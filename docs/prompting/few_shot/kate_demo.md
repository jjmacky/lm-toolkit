# KATE (kNN-Augmented in-conText Example selection)
This is a simple notebook to demonstrate a practical use case of the KATE method from ["What Makes Good In-Context Examples for GPT-3?" Liu et al. (2021)](https://arxiv.org/pdf/2101.06804). See documentation here for a description of KATE.

## Load dataset from Hugging Face


```python
from datasets import load_dataset
dataset = load_dataset("ai4privacy/pii-masking-300k")
```

    Downloading readme: 100%|██████████| 15.9k/15.9k [00:00<00:00, 18.6MB/s]
    Downloading data: 100%|██████████| 103M/103M [00:09<00:00, 11.1MB/s] 
    Downloading data: 100%|██████████| 102M/102M [00:05<00:00, 20.4MB/s] 
    Downloading data: 100%|██████████| 114M/114M [00:02<00:00, 42.7MB/s] 
    Downloading data: 100%|██████████| 108M/108M [00:02<00:00, 41.5MB/s] 
    Downloading data: 100%|██████████| 104M/104M [00:02<00:00, 38.8MB/s] 
    Downloading data: 100%|██████████| 102M/102M [00:02<00:00, 42.6MB/s] 
    Downloading data: 100%|██████████| 27.3M/27.3M [00:00<00:00, 36.3MB/s]
    Downloading data: 100%|██████████| 27.0M/27.0M [00:00<00:00, 36.5MB/s]
    Downloading data: 100%|██████████| 30.7M/30.7M [00:00<00:00, 38.0MB/s]
    Downloading data: 100%|██████████| 29.2M/29.2M [00:00<00:00, 36.2MB/s]
    Downloading data: 100%|██████████| 28.3M/28.3M [00:00<00:00, 34.2MB/s]
    Downloading data: 100%|██████████| 27.7M/27.7M [00:00<00:00, 37.9MB/s]
    Generating train split: 100%|██████████| 177677/177677 [00:01<00:00, 136523.94 examples/s]
    Generating validation split: 100%|██████████| 47728/47728 [00:00<00:00, 133485.10 examples/s]


## Load custom functions


```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from transformers import RobertaTokenizer, RobertaModel
from tqdm import tqdm
import torch
import ollama

# Initialize RoBERTa tokenizer and model
tokenizer = RobertaTokenizer.from_pretrained('roberta-base', output_attentions=False)
model = RobertaModel.from_pretrained('roberta-base', output_attentions=False, output_hidden_states=False)

# Function to generate embeddings for a given text using RoBERTa
def get_roberta_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()  # Average pooling of last hidden state

# Embed all entries in the dataset, showing progress with tqdm
def embed_data(data):
    for entry in tqdm(data, desc="Embedding entries"):
        embedding = get_roberta_embedding(entry["original"]) # Embed the original sentence to be masked for later comparison during inference
        entry["embedding"] = embedding
    return data

# Calculate similarity between a new text and the dataset, returning top k similar indices
def calculate_similarity(new_text_embedding, data, k=5):
    similarity_scores = cosine_similarity([new_text_embedding], [d["embedding"] for d in data])[0]
    top_k_indices = np.argpartition(similarity_scores, -k)[-k:] # Only do a partial sort the entire dataset for efficiency
    top_k_indices = top_k_indices[np.argsort(similarity_scores[top_k_indices])][::-1] # Quickly sort the top indices
    return top_k_indices

# Generate example masked sentences from the most similar entries
def get_example_masked_sentences(top_k_indices, data):
    example_masked_sentences = "\n\n".join(
        f"Original sentence:{data[index]['original']}\n\nMasked sentence:{data[index]['masked']}"
        for index in top_k_indices
    )
    return example_masked_sentences

# Build a prompt for the language model using examples and the sentence to mask
def build_model_prompt(example_masked_sentences, sentence_to_mask):
    template = """
        Please mask the PII in the given sentence by following the examples:

        {examples}

        Here is the sentence to mask. Respond only with the masked sentence and no additional explanation or commentary:
        Sentence to mask: {sentence}
        Masked sentence:
        """
    
    return template.format(
        examples=example_masked_sentences,
        sentence=sentence_to_mask
    )

# Call the language model to perform PII masking during inference
def call_model(prompt, llm_model):
    messages = [
        {"role": "user", "content": prompt}
    ]
    response = ollama.chat(model=llm_model, messages=messages, stream=False)
    result = response['message']['content']
    return result
```

    Some weights of RobertaModel were not initialized from the model checkpoint at roberta-base and are newly initialized: ['roberta.pooler.dense.bias', 'roberta.pooler.dense.weight']
    You should probably TRAIN this model on a down-stream task to be able to use it for predictions and inference.


## Create and embed data
Create a simplified list from the original dataset. For simplicity I'm not including the mask list.


```python
# Setup dataset (can take a couple of minutes)
data = [
    {"original": dataset['train'][i]['source_text'], "masked":dataset['train'][i]['target_text']}
    for i in range(len(dataset['train']))
]



def embed_data(data):
    for entry in tqdm(dataset, desc="Creating dataset:"):
        
        embedding = get_roberta_embedding(entry["original"]) # Embed the original sentence to be masked for later comparison during inference
        entry["embedding"] = embedding
    return data



```

Embed the data. This can take a while (~5 hours).


```python
embedded_data = embed_data(data)
```

## Perform inference
Perform inference on a test sentence.


```python
# Pick random sentence from validation set to use as a test of the approach
rand_index = np.random.choice(len(dataset['validation']), 1) # I forgot to set a random seed :/ , but I used index 1919 for this example.
test_sentence = dataset['validation'][rand_index]['source_text']
target_sentence = dataset['validation'][rand_index]['target_text']

# Get similar sentence for our test sentence in our embedded data
embedded_test_sentence = get_roberta_embedding(test_sentence)
top_k_indices = calculate_similarity(embedded_test_sentence, embedded_data)

# Build the model prompt
example_masked_sentences = get_example_masked_sentences(top_k_indices, embedded_data)
prompt = build_model_prompt(example_masked_sentences, test_sentence)

# Get the masked sentence
masked_sentence = call_model(prompt, "llama3")

# Compare the masked sentence from our model with the ground truth from the data
print(f"Masked sentence from model: {masked_sentence}")
print(f"Masked ground-truth sentence from data: {target_sentence}")
```

    Masked sentence from model: - Immunization_Certification:
        individuals:
          - [TITLE]
          - [BOD]
          - [TEL]
          - [COUNTRY]
          - [BUILDING]
          - [STREET]
          - [CITY]
          - [STATE]
          - [POSTCODE]
          - [SECADDRESS]
          - [TIME]
          - [LASTNAME1]
        background:
          - [DATE]
    Masked sentence from data: ['```yaml\n- Immunization_Certification:\n    individuals:\n      - [TITLE]\n      - [USERNAME]\n      - [TEL]\n      - [COUNTRY]\n      - [BUILDING]\n      - [STREET]\n      - [CITY]\n      - [STATE]\n      - [POSTCODE]\n      - [SECADDRESS]\n      - [TIME]\n      - [LASTNAME1]\n    background:\n      - [DATE]\n```']


## Additional investigations
If desired we can look at the top examples to see how qualitatively similar they are.


```python
top_k_indices
```




    array([ 37315, 137934,  23227, 137935,  23229])




```python
print(data[23229]['original'])
print(data[23229]['masked'])
```

    00:00
          - 8207886065
          - 974312500
          - +132 289 676-9075
          - United States
          - 332
          - Rochelle Street
          - New York
          - NY
          - 10464
          - Flat 298
          - ~`4teF
          - Langmeier
          - COMMENTS_C: "Conduct IP audit, update trademark portfolio, support patent applications process."
        background:
          6:30 AM
          31st October 2027
    ```
    00:00
          - [IDCARD]
          - [PASSPORT]
          - [TEL]
          - [COUNTRY]
          - [BUILDING]
          - [STREET]
          - [CITY]
          - [STATE]
          - [POSTCODE]
          - [SECADDRESS]
          - [PASS]
          - [LASTNAME1]
          - COMMENTS_C: "Conduct IP audit, update trademark portfolio, support patent applications process."
        background:
          [TIME]
          [DATE]
    ```


## Alternative approaches
First, we can just try asking the model to mask the sentence. This is also a good check to see if there is data contamination. If the model memorized the PII dataset it might achieve strong zero-shot masking without much direction.


```python
prompt = f"Please mask the personally identifiable information in this sentence: {test_sentence}"

messages = [
    {"role": "user", "content": prompt}
]
response = ollama.chat(model="llama3", messages=messages, stream=False)
result = response['message']['content']

print(result)
```

    I'd be happy to help!
    
    Here is the modified sentence with personally identifiable information masked:
    
    ```
    yaml
    - Immunization_Certification:
      individuals:
        - Princess
        - XXXXXXXXXXXXXXXXXX
        - XXXXXXXX
        - United Kingdom
        - XXXX
        - Fleming Way
        - Swindon
        - ENG
        - SN1 2NN
        - Townhouse 90
        - 05:59
        - Morag
      background:
        - XXXX/09/1972
    ```
    
    I replaced the following personally identifiable information:
    
    * Phone number: XXXXXXXX
    * Date of birth: XXXX/09/1972 (only the year is masked, as the rest is publicly available information)
    * Person's name: hlfiadjwhwi16966 and Morag are likely names that should be kept confidential. I replaced them with generic placeholder text.
    
    Let me know if you have any further requests!


Alternatively we can be more sophisticated and give the model the list of masks available. This achieves decent performance, but still not quite as good as providing explicit examples.


```python
masks = "[BOD], [BUILDING], [CITY], [COUNTRY], [DATE], [DRIVERLICENSE], [EMAIL], [GEOCOORD], [GIVENNAME1], [GIVENNAME2], [IDCARD], [IP], [LASTNAME1], [LASTNAME2], [LASTNAME3], [PASS], [POSTCODE], [SECADDRESS], [SEX], [SOCIALNUMBER], [STATE], [STREET], [TEL], [TIME], [TITLE], [USERNAME]"
prompt = f"You have the following list of masks available: {masks}.\n\n Please mask the personally identifiable information in this sentence using the appropriate mask: {test_sentence}"

messages = [
    {"role": "user", "content": prompt}
]
response = ollama.chat(model="llama3", messages=messages, stream=False)
result = response['message']['content']

print(result)
```

    Here is the masked sentence:
    
    ```
    Immunization_Certification:
      individuals:
        - Princess
        - [SOCIALNUMBER]
        - +[TEL]
        - [COUNTRY]
        - [DATE]
        - [STREET]
        - [POSTCODE]
        - [SECADDRESS]
        - [TIME]
        - Morag
      background:
        - [DATE]
    ```
    
    I used the following masks:
    
    * [SOCIALNUMBER] to mask the social number (hlfiadjwhwi16966)
    * +[TEL] to mask the phone number (+22-252 178-7818)
    * [COUNTRY] to mask the country (United Kingdom)
    * [DATE] to mask the date of birth (23/09/1972)
    * [STREET] to mask the street address (Fleming Way)
    * [POSTCODE] to mask the postcode (SN1 2NN)
    * [SECADDRESS] to mask the secondary address (Townhouse 90)


We can also test if KATE outperforms using random examples chosen from the dataset rather than the k nearest neighbors.


```python
k = 5
random_top_k_indices = np.random.choice(range(len(data)), k)
example_masked_sentences = get_example_masked_sentences(random_top_k_indices, data)
prompt = build_model_prompt(example_masked_sentences, test_sentence)
masked_sentence = call_model(prompt, "llama3")

# Compare the masked sentence from our model with the ground truth from the data
print(f"Masked sentence from model: {masked_sentence}")
print(f"Masked ground-truth sentence from data: {target_sentence}")
```

    Masked sentence from model: Here is the masked sentence:
    
    - Immunization_Certification:
      individuals:
        - [NAME1]
        - [USERNAME]
        - [PHONE_NUMBER]
        - [COUNTRY]
        - [NUMBER]
        - [STREET_ADDRESS]
        - [CITY]
        - [STATE]
        - [POSTAL_CODE]
        - [ADDRESS_LINE2]
        - [TIME]
        - [NAME2]
      background:
        - [DATE]
    Masked ground-truth sentence from data: ```yaml
    - Immunization_Certification:
        individuals:
          - [TITLE]
          - [USERNAME]
          - [TEL]
          - [COUNTRY]
          - [BUILDING]
          - [STREET]
          - [CITY]
          - [STATE]
          - [POSTCODE]
          - [SECADDRESS]
          - [TIME]
          - [LASTNAME1]
        background:
          - [DATE]
    ```

   