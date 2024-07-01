## SimToM
SimToM (Simulated Theory of Mind) is a technique based on the theory of mind exercise where a language model is encouraged to think through which participants in a passage know specific pieces of information from their perspective. This approach aims to improve the language model's ability to understand and reason about the mental states, beliefs, and perspectives of characters or agents in a given context.

### How to use it
To use SimToM, first provide the language model with the relevant context or story. Then, prompt the model to consider the knowledge and perspective of a particular character in that context. Finally, ask the model to answer a question or carry out an instruction based on that character's perspective.

[See "Prompting" section for usage details](#prompting).

### When to use it
!!! tip "When to use SimToM prompting"
    SimToM is most applicable to tasks that involve understanding the mental states, beliefs, and perspectives of characters or agents in a given context. This could include:

    - Story analysis and comprehension.
    - Dialogue or narrative understanding and generation.
    - Social reasoning and interaction.
    - Reasoning about agent behavior (e.g., in multi-agent systems or game theory).
    - Math word problems that involve multiple characters with different knowledge states.

### What to know
The SimToM technique is inspired by the cognitive science theory called "Simulation Theory" ([Goldman, 2006](https://academic.oup.com/book/7488)). This theory proposes that humans use their own mental states as a model to understand and predict the mental states of others. The process involves two main steps: perspective-taking, where one imagines oneself in another person's situation, and mental state attribution, where one uses this simulated perspective to infer the other person's beliefs, desires, and intentions.

Wilf et al. (2023) apply this idea to language models by introducing a two-stage prompting framework:

1. **Perspective-taking:** The language model is prompted to filter the context to only include the events and information that a particular character knows about. This step helps the model identify and prioritize the most important aspects of the input context from the character's perspective.
2. **Question-answering:** The language model is then asked to answer a question about that character's mental state, using only the filtered context from the perspective-taking step. By using the refined context, the model can generate more focused and accurate responses.

SimToM first filters context based on what the character in question knows before answering a question about their mental state. This approach helps the language model to focus on the relevant information and avoid using knowledge that the character does not possess.

For additional clarity on SimToM, an example is shown below from Wilf et al., 2023.

![An image of a SimToM prompt example](../../images/zero_shot/simtom.png)

### Best practices
!!! tip "Best practice for SimToM prompting"
    - Perform the perspective-taking and question-answering steps as two separate prompts. Wilf et al. (2023) found this worked better than combining them into a single prompt.
    - SimToM can be improved via few-shot prompting where several example persepctives are provided to the model during prompting.

### What to watch out for
!!! warning "Watch to watch out for SimToM prompting"
    - Current datasets only test hiding information for perspective-taking, but real-world scenarios may require inferring unseen information as well.
    - Models can sometimes "hallucinate" information during perspective-taking that is not stated in the original context.
    - SimToM tends to be most effective for small and mid-sized models and may be less impactful for the most advanced model versions. (In my testing, GPT-4 did not have trouble understanding perspectives without being explicitly prompted).

### Citations
Wilf, A., Lee, S. S., Liang, P. P., & Morency, L.-P. (2023). Think Twice: Perspective-Taking Improves Large Language Models' Theory-of-Mind Capabilities. [arXiv preprint arXiv:2311.10227](https://arxiv.org/abs/2311.10227).

### Prompting
#### Prompt template
SimToM involves a two-step prompt framework.

Perspective-taking prompt:
> The following is a sequence of events: <br>
> {story} <br>
> Which events does {character_name} know about?

Question-answering prompt:
> {story from character_name's perspective} <br>
> Answer the following question: <br>
> {question} <br>

#### Prompt example
Step 1: perspective-taking prompt:
> The following is a sequence of events: John and Emma are best friends. One day, John tells Emma that he has hidden a surprise gift for her in his room. Emma goes to John's room to look for the gift, but she can't find it. While Emma is searching, John enters the room and moves the gift from its original hiding place to a new spot under his bed. Emma doesn't see John do this. After a while, Emma gives up and leaves the room. Which events does Emma know about?

Model response (ChatGPT 4o):
> Emma knows about the following events: John told Emma that he has hidden a surprise gift for her in his room. Emma went to John's room to look for the gift. Emma couldn't find the gift. Emma searched for a while but eventually gave up and left the room.

Step 2: we now form the question-answering prompt using the model output from the perspective-taking prompt:
> John told Emma that he has hidden a surprise gift for her in his room. Emma went to John's room to look for the gift. Emma couldn't find the gift. Emma searched for a while but eventually gave up and left the room.
> Where does Emma think the gift is hidden?

Model response (ChatGPT 3.5):
> Based on the information provided, Emma most likely thinks the gift is still hidden somewhere in John's room, but she doesn't know the exact location. Since Emma was not aware that John moved the gift to a new hiding spot under his bed while she was searching, she would assume that the gift is still in its original hiding place, which remains unknown to her.

#### API example
```python
from openai import OpenAI

# Set your API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# Establish the context
initial_prompt = "In a mystery novel, Detective Sarah is investigating a murder at a mansion. The victim, Mr. Thompson, was found dead in his study. Sarah interviews the butler, James, who mentions that he saw the gardener, Mike, arguing with Mr. Thompson the day before the murder. Later, Sarah discovers that Mr. Thompson's will was recently changed, leaving most of his estate to his secretary, Lisa."

# Step 1: Perspective-taking - Filter the context to include information known to Detective Sarah
perspective_prompt = f"Given the following context about the murder investigation, identify the key facts that Detective Sarah knows: {context}"
perspective_completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": perspective_prompt}
  ]
)
relevant_facts = perspective_completion.choices[0].message['content']

# Step 2: Question-answering - Determine the most likely suspect based on Detective Sarah's knowledge
suspect_prompt = f"Based on the following facts known to Detective Sarah, who does she most likely suspect of murdering Mr. Thompson and why? {relevant_facts}"
suspect_completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": suspect_prompt}
  ]
)

# Print the response from the model
print(suspect_completion.choices[0].message.content)
```