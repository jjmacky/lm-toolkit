---
date: 17 June 2024
---

## Overview
Plain vanilla prompting involves asking the language model to answer a question or perform an instruction without any additional "tricks" or prompt templates.

!!! important
    You should generally try to use plain vanilla prompting before moving on to more involved prompting methods.

## When to use it
!!! tip "Know when to use plain vanilla prompting"
    - Plain vanilla zero-shot prompting should be your first choice when trying to get an LLM to do a task. Start by simply asking the model what you want in plain language.
    - Plain vanilla prompting is usually sufficient for most tasks, especially when leveraging a state-of-the-art model like those from OpenAI, Anthropic, and Google.
    - Works well for quick, straightforward tasks that don't require a lot of specificity.
    - Effective when you want a general response without providing a lot of context, examples, or instructions.
    - If plain zero-shot prompting gives decent results, there may not be a need for more complex prompting techniques. More exotic methods can be explored if the plain prompt is insufficient.

## What to know
Plain vanilla zero-shot prompting means giving the model a prompt without any examples or training or using special "tricks," relying on the model's existing knowledge and capabilities. Plain vanilla prompting keeps things simple by stating what you want the model to do in direct terms, avoiding overcomplicating the prompt. The model will do its best to respond appropriately based on its training, but results may vary depending on the model's knowledge and the complexity of the task.

## Best practices
!!! tip "Best practices for plain vanilla prompting"
    - Start with plain vanilla prompting before trying more involved prompting techniques.
    - If the initial plain prompt doesn't give great results, try slightly rewording or clarifying it before moving on to more complex prompting approaches.
    - Be clear and specific about what you want, but don't feel the need to provide a lot of additional details in the prompt.
    - Consider the model's knowledge and capabilities when assessing if a plain prompt is likely to be sufficient for the task.

## What to watch out for
!!! warning "What to watch out for with plain vanilla prompting"
    - Don't expect perfect results from a plain zero-shot prompt, especially for very complex tasks with less powerful language models. Use it as a starting point.
    - If the model struggles or gives irrelevant responses, the prompt may need more specificity or the task may be beyond the model's capabilities without further instruction.

## Prompting
### Prompt template
The plain vanilla prompt template is to simple ask a language model a question or instruction without additional prompt prefixes or suffixes.
> {question or instruction} <br>

### Prompt example
User prompt:
> What should I do in Paris over three days with $300 to spend on sightseeing?

Model response (Llama 8B):
> Paris! With $300 to spend on sightseeing, you can experience some of the 
> city's iconic landmarks and cultural attractions. Here's a suggested 
> itinerary for your three-day trip:
> 
> Day 1: Morning (approx. $50)
> 
> * Start with a visit to the Eiffel Tower (lift ticket: €29-€57 per 
> person). You can take the stairs or elevator to the top for stunning views 
> of the city.
> * From there, walk to the nearby Champ de Mars park and enjoy the street 
> performers and vendors.
> 
> Day 2:
> 
> * Visit the Louvre Museum (free admission on Friday evenings from 6:00 pm 
> to 9:45 pm; otherwise, tickets are €18 per person). Spend a few hours 
> exploring the world-famous museum's collection, including the Mona Lisa.
> * After lunch, head to Notre-Dame Cathedral (free admission), one of the 
> most famous churches in the world. Take a moment to admire its Gothic 
> architecture and peaceful atmosphere.
> 
> Day 3:
> 
> * Visit the Musée d'Orsay (tickets: €12 per person). This museum features 
> an impressive collection of Impressionist and Post-Impressionist art, 
> including works by Monet, Renoir, and Van Gogh.
> * End your trip with a Seine River Cruise (€15-€20 per person), which 
> offers a unique perspective on the city's landmarks and bridges.
> 
> Budget Breakdown:
> 
> * Eiffel Tower: $35-$70
> * Louvre Museum: $18 (free admission on Friday evenings)
> * Notre-Dame Cathedral: free
> * Musée d'Orsay: $12
> * Seine River Cruise: $15-20
> 
> Total budget: $80-$130
> 
> Tips:
> 
> 1. Consider purchasing a Paris Museum Pass, which grants you entry to many 
> popular attractions and can help you save time and money.
> 2. Pack a picnic lunch or grab food from a street vendor to save on dining 
> expenses.
> 3. Take advantage of free walking tours or self-guided explorations of 
> neighborhoods like Montmartre, Le Marais, or Saint-Germain-des-Prés.
> 
> With $300 to spend on sightseeing, you can experience some of the best 
> Paris has to offer while still keeping your expenses in check. Enjoy your 
> trip!

### API example
```python
from openai import OpenAI

# Set your API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

prompt = "Outline a marketing strategy for a new tech startup."

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": prompt}
  ]
)

# Print the response from the model
print(completion.choices[0].message.content)
```