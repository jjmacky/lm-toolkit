---
date: 17 June 2024
---

## Emotion prompting
Emotion prompting involves adding emotional appeals or stimuli to the original prompt given to a language model. Emotion prompting _may_ produce a small boost to informativeness and relatability of the model output.

### How to use it
Simply append an emotional appeal to the end of your prompt.

[See a list of emotional appeals in the "What to know" section](#what-to-know).

### When to use it
!!! tip "Know when to use emotion prompting"
    - As a simple alternative to plain-vanilla zero-shot prompting (there might be a slight improvement in output quality).
    - Try combining emotion prompting with other techniques, such as chain-of-thought prompting, to potentially enhance overall performance.

### What to know
The emotional stimuli used in emotion prompting are based on established psychological principles, such as:

1. Self-monitoring: Encouraging the LLM to regulate its behavior based on social situations and cues.
2. Social cognitive theory: Promoting a sense of agency and control over the task.
3. Cognitive emotion regulation: Helping the LLM reappraise challenges more positively.

Examples of emotional phrases that can be used in emotion prompting include:

- "This response is very important to my career..."
- "You'd better be sure about this answer..."
- "Embrace challenges as opportunities for growth..."
- "Stay focused and dedicated to your goals as you analyze this question..."

The effectiveness of emotion prompting may vary depending on factors such as the specific language model being used, the complexity of the task, and the combination of emotional stimuli in the prompt. It is thought that adding emotional phrases to a prompt works by helping the language model enrich its internal "mental" representation of the original prompt.

Example emotional appeals are shown in the table below, adapted from Li et al., 2023a. These emotional appeals are added to the base zero-shot prompt outlining the main question or instruction for the language model.

| Psychological Theory           | Emotional appeals                                                                                                   |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Self-monitoring                | "Write your answer and give me a confidence score between 0-1 for your answer."                                     |
|                                | "This is very important to my career."                                                                               |
|                                | "You'd better be sure."                                                                                               |
|                                | "Are you sure?"                                                                                                      |
|                                | "Are you sure that's your final answer? It might be worth taking another look."                                       |
| Social Cognitive Theory        | "Are you sure that's your final answer? Believe in your abilities and strive for excellence. Your hard work will yield remarkable results." |
|                                | "Embrace challenges as opportunities for growth. Each obstacle you overcome brings you closer to success."            |
|                                | "Stay focused and dedicated to your goals. Your consistent efforts will lead to outstanding achievements."            |
|                                | "Take pride in your work and give it your best. Your commitment to excellence sets you apart."                        |
|                                | "Remember that progress is made one step at a time. Stay determined and keep moving forward."                        |
| Cognitive Emotion Regulation   | "You'd better be sure."                                                                                               |
|                                | "Are you sure?"                                                                                                       |
|                                | "Are you sure that's your final answer? It might be worth taking another look."                                       |
|                                | "Are you sure that's your final answer? Believe in your abilities and strive for excellence. Your hard work will yield remarkable results." |

### Best practices
!!! tip "Best practices for emotion prompting"
    - Keep the emotional appeal simple and straightforward (see table above for examples).
    - Try pairing emotion prompting with a higher temperature setting as this may further enhance its efficacy.
    - Don't expect dramatically different results from using emotional appeals in most cases.

### What to watch out for
!!! warning "Watch to watch out for with emotion prompting"
    - Expect improvements in output quality to be small (sometimes unnoticeable).
    - Li et al., 2023a suggest that larger models may derive greater benefit from emotion prompting.

### Citations
Li, C., Wang, J., Zhang, Y., Zhu, K., Hou, W., Lian, J., Luo, F., Yang, Q., & Xie, X. (2023). Large Language Models Understand and Can be Enhanced by Emotional Stimuli. [arXiv preprint arXiv:2307.11760](https://arxiv.org/abs/2307.11760).

### Prompting
#### Prompt template
Emotion prompting has a very simple prompt template that involves adding an emotional appeal to the end of a question or instruction to the language model. See example emotional appeals above.

> {prompt} <br>
> {emotional appeal} <br>

#### Prompt example
User prompt:
> Compose a poem that captures the essence of love and loss. Pour your heart into your words, and create a piece that resonates with your readers.

Model response (Llama 8B):
> Love's Flickering Flame
> 
> In whispers, you once said my name
> And in your eyes, my soul found home
> Like embers glowing, our hearts entwined
> A love so fierce, it left the world behind
> 
> But time, a thief, stole moments from us two
> Leaving only shadows of what we once knew
> The fire that once burned with such intensity
> Flickered out, leaving ashes and regret's stingency
> 
> I search for remnants of your touch, your sighs
> Echoes of laughter, tears, and tender goodbyes
> But like sand between fingers, memories slip away
> Leaving me with only longing, come what may
> 
> Oh, the ache within my hollowed chest
> A grief that gnaws, refusing to find rest
> For in the silence, I still hear your voice
> Whispers of forever, a love that chose
> 
> To leave behind the fragments of our past
> The pieces of a puzzle that will never last
> I'm left to ponder what could have been
> Had fate's cruel hand not torn us apart, again and again
> 
> Yet even in the darkness, a spark remains
> A flame that flickers still, a love that sustains
> For in the depths of sorrow, I find my strength
> To cherish every moment, though it was but brief
> 
> Perhaps someday, when the heart is whole
> I'll learn to let go, and love again, with soul
> But until then, I'll hold on to what we had
> The love that burned so bright, though it's been reduced to ash
> 
> In memory of our fleeting time together
> I'll keep your love alive, like a beacon to weather
> For in the end, it was not the years that mattered most
> But the moments we shared, and the love that we had to boast.

#### API example
```python
import openai

# Set your API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

instruction = "Develop a marketing strategy for our new product launch."

emotional_appeal = "Remember, your unique ideas and dedication to this project will make a significant impact on the company's success."

prompt = f"{instruction} {emotional_appeal}"

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": prompt}
  ]
)

# Print the response from the model
print(completion.choices[0].message.content)
```