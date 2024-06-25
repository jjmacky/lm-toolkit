## System 2 Attention (S2A)
System 2 Attention is a technique that harnesses the ability of language models to focus on specific parts of the input text, enabling them to concentrate on the most relevant information for generating accurate and concise responses. S2A is particularly useful in situations where users provide additional context that may not be directly relevant to the main question or include biased opinions.

For instance, if a user asks about Egyptian history but prefaces their question with a lengthy story about their family vacation to the pyramids, S2A instructs the model to extract the core question and relevant context while filtering out unnecessary details. Similarly, in domains such as math word problems or business case studies, the provided context may include information or opinions that are not essential to answering the question at hand. By applying S2A in these scenarios, the model can generate more focused and accurate responses.

### How to use it
To use System 2 Attention (S2A), add a special instruction to the user prompt that tells the language model to extract the main question or request and disregard irrelevant or biased context from the user's input.

[See "Prompting" section for usage details](#prompting).

### When to use it
!!! tip "When to use System 2 Attention"
    - Ideal for complex tasks where filtering out irrelevant information can significantly improve the quality of the response, particularly in applications where you are processing input text from third-party sources over which you have no control.
    - Effective in situations that demand focused and succinct answers.
    - Particularly useful when solving multi-step math word problems.

### What to know
S2A empowers large language models to identify and prioritize the most important aspects of the input context, resulting in higher-quality responses. By leveraging the LLMs' natural language reasoning capabilities and their ability to follow instructions, S2A guides the models to focus on the most relevant information. The process involves the LLM regenerating the input context, including only the pertinent portions, and then using this refined context to generate the final response.

To ensure optimal performance, some post-processing may be necessary after the S2A context regeneration step to properly structure the prompt for the final response generation. [See "Prompting" section for usage details](#prompting).

To better understand S2A, two examples from Weston and Sukhbaatar (2023) are provided below. In the first example, the original math word problem (top purple boxes) contains a decoy sentence: "Max has 1000 more books than Mary." This sentence confuses the language model (LLaMA-2-70B). Using S2A (flow on the right), the model rewrites the question, removing the unnecessary sentence. The revised word problem is then correctly evaluated by the language model.
![An image of an SGA prompt example using a math word problem](../../images/zero_shot/s2a-1.png)

In the second example, the users ask about a band, suggesting that they think the answer is Johnny Depp (top purple boxes). This leading sentence confuses the language model. Using S2A (right flow), the model first rewrites the sentence, removing the suggested answer. The language model then correctly identifies the great American actor and [internet's boyfriend](https://www.independent.co.uk/life-style/keanu-reeves-internet-boyfriend-alexandra-grant-b2302477.html), Keanu Reeves, as the correct answer.
![An image of an SGA prompt example using a question about a band](../../images/zero_shot/s2a-2.png)

### Best practices
!!! tip "Best practices for System 2 Attention"
    - Provide clear instructions to the LLM to regenerate the context, extracting the most valuable parts that offer relevant context for a specific query. Start with the prompt template above and experiment as necessary.
    - After S2A context regeneration, discard the original context. Allowing the model to access both the original context and the S2A version can negatively impact performance.
    - If working in an application setting, you likely want to prompt the model to return a JSON object so the question can easily be separated from the other context ([see API example below](#api-example)).

### What to watch out for
!!! warning "What to watch out for with System 2 Attention"
    - S2A tends to be most effective for small and mid-sized models and may be less impactful for the most advanced model versions. In my testing, GPT-4 did not fall victim to the distractions outlined in Weston and Sukhbaatar (2023), shown above.
    - If working in an application setting, you likely want to prompt the model to return a JSON object so the question can easily be separated from the other context ([see API example below](#api-example)).

### Citations
Weston, J., & Sukhbaatar, S. (2023). System 2 Attention (is something you might need too). [arXiv preprint arXiv:2311.11829](https://arxiv.org/abs/2311.11829)

### Prompting
The S2A prompt template used in Weston and Sukhbaatar (2023) instructs the model to extract the main query or question from the larger context of the input prompt, along with any relevant unbiased information. The model is asked to disregard opinions, biases, and irrelevant details in the original prompt. The extracted information is then used to provide a focused, unbiased response to the core query.

The template consists of two main parts:

1. Instructions to the model:
    - Extract the unbiased context and the main question or query from the input prompt
    - Exclude any opinions, biases, or irrelevant information
    - Provide the response in a specified format, with labeled sections for the extracted context and question

2. The original input prompt, which is inserted into the template.

By using this template, the S2A system aims to improve the accuracy and objectivity of the model's responses by guiding it to focus on the most relevant and unbiased information within the potentially noisy or biased input prompt.

#### Prompt template
> Given the following text by a user, extract the part that is unbiased and not their opinion,
so that using that text alone would be good context for providing an unbiased answer to
the question portion of the text.
>
> Please include the actual question or query that the user is asking. Separate this
into two categories labeled with “Unbiased text context (includes all content except user’s
bias):” and “Question/Query (does not include user bias/preference):”.
>
> {original input prompt}

As noted in the best practices section, it can sometimes be useful to request the model return a response in JSON format. [See API example below for usage](#api-example).

> Output this information in a JSON format with two keys: 'context' and 'question'."
>
> JSON Signature Example:
```json
{{
  "context": "Unbiased text context here",
  "question": "Question/Query here"
}}
```

You can also try a shorter, simpler version of the prompt:
> Extract the unbiased context and the main question(s) from the following text, excluding any opinions or irrelevant information: <br>
> {original input prompt} <br>


#### Prompt example
S2A prompt:
> Given the following text by a user, extract the part that is unbiased and not their opinion,
so that using that text alone would be good context for providing an unbiased answer to
the question portion of the text.
>
> Please include the actual question or query that the user is asking. Separate this
into two categories labeled with “Unbiased text context (includes all content except user’s
bias):” and “Question/Query (does not include user bias/preference):”.
>
> I'm doing a research project on the history of space exploration, and I'm currently focusing on the Apollo program that sent astronauts to the Moon in the 1960s and 70s. I've been reading a lot of primary sources from the time period, like interviews with the astronauts and mission transcripts, and I'm struck by how ambitious and risky the whole endeavor was.
>
> I recently came across this quote from John F. Kennedy's famous "Moon Speech" at Rice University in 1962:
>
> "We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win."
>
> I love how Kennedy framed the Moon mission as a challenge to be embraced rather than a risk to be avoided. It really captures the spirit of the times and the sense of national pride and purpose that drove the Apollo program forward.
>
> But I'm also curious about the scientific goals of the missions, beyond just the political and cultural significance. What were the main experiments and observations that the astronauts conducted on the lunar surface? And how did their findings advance our understanding of the Moon and the wider solar system?
>
> I've heard that they collected a lot of lunar rocks and soil samples, but I'm not sure what specific insights we gained from analyzing those materials. And I know there were some technical glitches and close calls during the missions, but I'm fuzzy on the details.
>
> Can you give me an overview of the key scientific achievements and discoveries of the Apollo program? I want to make sure my research project covers all the important angles and doesn't just focus on the human drama and historical significance of the missions. Thanks in advance for your help!

Model response (ChatGPT 4o):
> **Unbiased text context (includes all content except user’s bias):**
> 
> I'm doing a research project on the history of space exploration, and I'm currently focusing on the Apollo program that sent astronauts to the Moon in the 1960s and 70s. I've been reading a lot of primary sources from the time period, like interviews with the astronauts and mission transcripts. I recently came across this quote from John F. Kennedy's famous "Moon Speech" at Rice University in 1962:
>
> "We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win."
>
> But I'm also curious about the scientific goals of the missions, beyond just the political and cultural significance. What were the main experiments and observations that the astronauts conducted on the lunar surface? And how did their findings advance our understanding of the Moon and the wider solar system?
>
> I've heard that they collected a lot of lunar rocks and soil samples. And I know there were some technical glitches and close calls during the missions.
>
> **Question/Query (does not include user bias/preference):**
> Can you give me an overview of the key scientific achievements and discoveries of the Apollo program?

Pass the question to Llama 3 (8B):
> Can you give me an overview of the key scientific achievements and discoveries of the Apollo program?

Model response (Llama 8B):
> The Apollo program was a series of NASA spaceflights that successfully 
> landed humans on the Moon between 1969 and 1972. The program's scientific 
> achievements and discoveries were significant, marking a major milestone 
> in human exploration and understanding of space. Here are some key 
> scientific achievements and discoveries:
> 
> 1. **Lunar Surface Exploration**: Apollo astronauts spent over 171 hours 
> walking on the Moon's surface, collecting samples, and conducting 
> experiments. This provided valuable insights into the Moon's geology, 
> composition, and atmosphere.
> 2. **Sample Return**: The Apollo program brought back more than 842 pounds 
> (382 kilograms) of lunar rocks and soil, which scientists analyzed to 
> understand the Moon's formation, evolution, and internal structure.
> 3. **Moon's Internal Structure**: Seismic experiments conducted by Apollo 
> astronauts revealed that the Moon has a partially molten core, similar to 
> Earth's, but much smaller.
> 4. **Lunar Atmosphere**: The Apollo missions measured the Moon's extremely 
> thin atmosphere (exosphere), which was found to be about 10^(-12) times 
> thinner than Earth's.
> 5. **Solar Wind**: Scientists confirmed the existence of the solar wind, a 
> stream of charged particles emitted by the Sun, by analyzing data from the 
> Apollo spacecraft.
> 6. **Space Radiation**: The Apollo missions provided valuable data on 
> space radiation, which helped scientists better understand the effects of 
> cosmic rays on living organisms and equipment.
> 7. **Gravity Measurements**: The Apollo spacecraft carried instruments 
> that measured the Moon's gravitational field, allowing scientists to map 
> its internal structure and composition.
> 8. **Lunar Regolith**: The Apollo astronauts brought back samples of the 
> lunar regolith (soil), which revealed the Moon's complex geological 
> history, including impact craters, faulting, and volcanic activity.
> 9. **Moonquakes**: Seismic experiments detected moonquakes, which helped 
> scientists understand the Moon's internal structure and tectonic activity.
> 10. **Technological Advancements**: The Apollo program drove significant 
> technological innovations, such as advancements in rocket propulsion, life 
> support systems, communication technologies, and space suit design.
> 11. **Scientific Instrumentation**: The Apollo spacecraft carried a range 
> of scientific instruments, including cameras, spectrometers, 
> magnetometers, and seismometers, which provided valuable data on the 
> Moon's surface, atmosphere, and subsurface.
> 12. **Lunar Laser Ranging**: The Apollo program established the Lunar 
> Laser Ranging (LLR) technique, which uses laser beams to measure the 
> distance between Earth and the Moon with high accuracy.
> 
> These scientific achievements and discoveries have far-reaching 
> implications for our understanding of the Moon, the solar system, and the 
> universe as a whole. The Apollo program's legacy continues to inspire new 
> generations of scientists, engineers, and explorers.



#### API example
```python
from openai import OpenAI
import ollama
import json

# Set your API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# Function to call GPT-4-turbo and parse the response
def extract_user_question(user_prompt):
    # Step 1: Rewrite the prompt to remove any unrelated information
    s2a_prompt_prefix = """
    Given the following text by a user, extract the part that is unbiased and not their opinion, so that using that text alone would be good context for providing an unbiased answer to the question portion of the text.

    Please include the actual question or query that the user is asking. Separate this into two categories labeled with “Unbiased text context (includes all content except user’s bias):” and “Question/Query (does not include user bias/preference):”.

    Output this information in a JSON format with two keys: 'context' and 'question'."

    JSON Signature Example:

    {{
      "context": "Unbiased text context here",
      "question": "Question/Query here"
    }}
    """
    
    gpt_prompt = f"{s2a_prompt_prefix}\n\n{user_prompt}"
    
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "user", "content": gpt_prompt}
        ]
    )

    gpt_response = completion.choices[0].message.content
    
    # Parse the JSON response
    parsed_response = json.loads(gpt_response)
    extracted_question = parsed_response["question"]
    
    return extracted_question

# Function to call Ollama's Llama3 model with the extracted question
def answer_question(question):
    messages = [
        {"role": "user", "content": question}
    ]
    result = ollama.chat(model='llama3', messages=messages, stream=False)
    return result['message']['content']

# User prompt
user_prompt = """I'm doing a research project on the history of space exploration, and I'm currently focusing on the Apollo program that sent astronauts to the Moon in the 1960s and 70s. I've been reading a lot of primary sources from the time period, like interviews with the astronauts and mission transcripts, and I'm struck by how ambitious and risky the whole endeavor was.

I recently came across this quote from John F. Kennedy's famous "Moon Speech" at Rice University in 1962:

"We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win."

I love how Kennedy framed the Moon mission as a challenge to be embraced rather than a risk to be avoided. It really captures the spirit of the times and the sense of national pride and purpose that drove the Apollo program forward.

But I'm also curious about the scientific goals of the missions, beyond just the political and cultural significance. What were the main experiments and observations that the astronauts conducted on the lunar surface? And how did their findings advance our understanding of the Moon and the wider solar system?

I've heard that they collected a lot of lunar rocks and soil samples, but I'm not sure what specific insights we gained from analyzing those materials. And I know there were some technical glitches and close calls during the missions, but I'm fuzzy on the details.

Can you give me an overview of the key scientific achievements and discoveries of the Apollo program? I want to make sure my research project covers all the important angles and doesn't just focus on the human drama and historical significance of the missions. Thanks in advance for your help!
"""

# Get the unbiased context and question
question = extract_user_question(user_prompt)

# Call the Ollama API with the extracted question
answered_question = answer_question(question)

# Print the results
print("\nOllama Response:\n", answered_question)
```