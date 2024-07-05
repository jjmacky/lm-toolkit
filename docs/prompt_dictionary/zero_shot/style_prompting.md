---
date: 22 June 2024
---

## Style prompting
Style prompting asks the model to take on a mood or style. It is usually reserved for creative writing tasks and may not be the best approach for eliciting factual information, writing formal presentations, or other activities that require a more neutral tone.

### How to use it
Style prompting simply involves adding stylistic requests to a standard prompt.

[See "The 10 aspects of style prompting" section for style ideas](#the-10-aspects-of-style-prompting).

### When to use it
!!! tip "When to use style prompting"
    - Useful when the tone, style, or genre of the output is important.
    - Ideal for creative tasks where the style of writing is crucial.

### What to know
Style prompting involves instructing a language model to generate text in a specific style, tone, mood, or genre. It can be used to control various stylistic aspects of the generated text, such as writing style, mood, pacing, and formatting.

The effectiveness of style prompting can vary depending on the specific language model being used and the combination of stylistic elements in the prompt. Some models may struggle with certain styles or have difficulty distinguishing between the style and the subject matter when the prompts become too complex.

### The 10 aspects of style prompting
There are 10 different aspects to consider when using style prompting (Lu et al., 2023a).

| Aspect           | Example Terms                                 | Examples                                                 |
|------------------|-----------------------------------------------|----------------------------------------------------------|
| Writing Style    | Flowery, Functional, Candid, Prosaic, Ornate, Poetic | "Write a functional passage about sunsets:"             |
|                  |                                               | "Write a flowery passage about writing a paper:"        |
| Tone             | Humorous, Formal, Dramatic, Optimistic, Sad, Emotional, Nostalgic, Uplifting, Inspirational, Bleak, Grim, Ironic, Satirical | "Write a humorous passage about love:"                  |
|                  |                                               | "Write a formal passage about love:"                    |
| Mood             | Angry, Sad, Fearful, Happy, Envious, Anxious, Proud, Regretful, Surprised, Loved, Disgusted | "Write a passage about humanity that makes the reader feel angry:" |
|                  |                                               | "Write a passage about love that makes the reader feel happy:" |
| Characterization | Direct, Indirect                              | "Write a story about lovers with indirect characterization:" |
|                  |                                               | "Write a story about cats with direct characterization:" |
| Pacing           | Fast, Slow                                    | "Write a fast-paced story about survivors:"             |
|                  |                                               | "Write a slow-paced story about lovers:"                |
| Plot             | Rebirth, Comedy, Overcoming the Monster, Rags to Riches, The Quest, Voyage and Return, Tragedy | "Write a story about lovers with a 'Tragedy' plot:"     |
|                  |                                               | "Write a story with a 'Rags to Riches' plot:"           |
| Genre            | Science Fiction, Mystery, Historical Fiction, Literary Fiction, Dystopian, Horror | "Write a science fiction story about survivors:"        |
|                  |                                               | "Write a mystery story about lovers:"                   |
| Numerical        | Five words, Ten sentences, Twenty paragraphs | "Write a sentence with five words about love:"          |
|                  |                                               | "Write a paragraph with ten sentences about cats:"       |
| Descriptive      | Concise, Long, Short, Brief, Detailed, In-depth | "Write a concise passage about running:"                |
|                  |                                               | "Write a detailed passage about love:"                  |
| Formatting       | Email, Code, Academic Paper                   | "Write an email to my teacher asking for help on math homework:" |
|                  |                                               | "Code Python code that sums two integers up:"           |

### Best practices
!!! tip "Best practices for style prompting"
    - Models may be sensitive to different combinations of style and mood so use trial and error to find the best combination for your use case.
    - Use the examples in the table above as a starting point.
    - Be specific and descriptive when defining the style you want the model to adopt.

### What to watch out for
!!! warning "What to watch out for with style prompting"
    - The model may confuse style with subject when prompts are too challenging.
    - Style prompting is most effective for creative writing tasks and may not be suitable for professional or formal contexts that require a neutral, objective tone.
    - Avoid using style prompting for tasks that require factual accuracy, as the focus on style may lead to less precise or reliable information.
    - The effectiveness of style prompting can vary depending on the language model being used, so test your prompts with different models to ensure optimal performance.

### Citations
Lu, A., Zhang, H., Zhang, Y., Wang, X., & Yang, D. (2023). Bounding the Capabilities of Large Language Models in Open Text Generation with Prompt Constraints. [arXiv preprint arXiv:2302.09185](https://arxiv.org/abs/2302.09185)

### Prompting
#### Prompt template
Style prompting has a simple prompt template. First, include style directions, then outline the task for the language model.
> {style directions} <br>
> {instruction} <br>

#### Prompt example
##### Creative writing task
User prompt:
> Write a fast-paced, sad mystery story about lovers.

Model response (Chat GPT4o):
> **The Last Echoes of Love**
> 
> **Chapter 1: The Whispering Woods**
> 
> The town of Ravenswood had always been a place of whispered legends and old secrets, but none more haunting than the tale of Emily and Nathan. Their love story was one for the ages, or so everyone believed.
> 
> Emily, a bright-eyed artist with dreams as vast as the sky, met Nathan, a brooding writer with a heart full of shadows, in the most unlikely of places—the Whispering Woods. It was said that those woods held the memories of the town, that if you listened closely, you could hear the voices of those long gone. Emily and Nathan were drawn to each other like moths to a flame, their love igniting with an intensity that left the town buzzing.
> 
> **Chapter 2: The Disappearance**
> 
> One crisp autumn evening, as the leaves painted the ground with hues of gold and red, Emily vanished. Nathan, desperate and distraught, scoured every corner of Ravenswood and beyond, but Emily was nowhere to be found. The only clue was a single painting left on her easel—an unfinished portrait of Nathan standing alone in the woods, his face etched with sorrow.
> 
> Days turned into weeks, and hope dwindled. Nathan, once a pillar of strength, became a ghost of himself, wandering the Whispering Woods in search of answers. The townsfolk whispered about curses and old magic, but no one could explain Emily's sudden disappearance.
> 
> **Chapter 3: The Letter**
> 
> One stormy night, as thunder roared and lightning cracked the sky, Nathan received a letter. The handwriting was unmistakably Emily's, delicate and graceful. The letter spoke of love and sorrow, of a secret too dangerous to reveal. She begged Nathan to stop searching, to let her go. But Nathan, consumed by his love and guilt, could not let her memory fade.
> 
> Driven by the cryptic letter, Nathan delved deeper into the town's history, uncovering dark secrets that had been buried for centuries. He learned of a tragic love affair, eerily similar to his own, that ended in bloodshed and betrayal. The lovers, it seemed, were cursed to relive their sorrow through the ages.
> 
> **Chapter 4: The Revelation**
> 
> As Nathan pieced together the fragments of the past, he realized the curse was linked to the very heart of the Whispering Woods. Desperate for answers, he ventured into the woods one last time, following the whispers that had haunted his dreams.
> 
> There, in a hidden glade bathed in the pale light of the moon, Nathan found Emily. She stood before an ancient tree, her eyes filled with both love and despair. She explained that the curse bound them to the woods, to the memories of the past. Each cycle, they found and lost each other, their love both their salvation and their doom.
> 
> **Chapter 5: The Choice**
> 
> Emily revealed that the curse could be broken, but at a great cost. One of them had to willingly let go, to embrace the darkness alone so the other could live freely. Nathan, his heart heavy with love and sorrow, made the choice. He would bear the burden, freeing Emily from their eternal torment.
> 
> As the first light of dawn broke through the trees, Nathan felt the curse lift. Emily's tear-streaked face was the last thing he saw before the darkness claimed him. She was free, but the price of their love was his eternal solitude.
> 
> **Epilogue: The Echoes**
> 
> Years passed, and Emily became a renowned artist, her works filled with the pain and beauty of her lost love. Ravenswood moved on, the whispers in the woods fading with time. But those who dared to venture into the Whispering Woods at dusk sometimes spoke of a solitary figure, a shadow among the trees, whispering the name of his lost love—Emily.
> 
> And in the quiet moments, when the wind sighed through the branches, you could almost hear the echoes of a love too powerful to be forgotten, a love that transcended time and fate.

##### Business task
User prompt:
> In a persuasive and motivational style outline a marketing strategy for a new tech startup, MindWell AI. MindWell AI is a personalized mental health and wellness platform that leverages artificial intelligence to provide users with tailored mental health resources, therapy sessions, mindfulness exercises, and daily well-being check-ins. The platform offers a combination of AI-driven chatbots for initial interactions and licensed therapists for more in-depth sessions.

Model response (ChatGPT 4o):
> **Marketing Strategy for MindWell AI: Elevating Mental Health with Technology**
> 
> **Vision Statement:**
> "Empowering minds, enhancing well-being, and fostering a healthier tomorrow with AI-driven personalized mental health care."
> 
> 1. **Market Research and Analysis**
>     1. **Identify Target Audience:**
>         - **Primary Target:** Individuals seeking mental health support, including those with anxiety, depression, and stress.
>         - **Secondary Target:** Employers looking to provide mental health resources to their employees.
>         - **Tertiary Target:** Healthcare providers and therapists interested in integrating AI into their practice.
>     2. **Competitor Analysis:**
>         - Analyze strengths and weaknesses of competitors like BetterHelp, Talkspace, and Calm.
>         - Identify gaps in their services to position MindWell AI as a superior alternative.
> 
> 2. **Brand Positioning and Messaging**
>     1. **Unique Selling Proposition (USP):**
>         - "MindWell AI combines cutting-edge AI technology with compassionate human touch to provide the most personalized mental health care experience."
>     2. **Brand Values:**
>         - **Personalization:** Tailored solutions for individual needs.
>         - **Accessibility:** Affordable and available anytime, anywhere.
>         - **Compassion:** Combining AI efficiency with human empathy.
>     3. **Key Messages:**
>         - "Your mental health companion, always ready to listen."
>         - "AI-powered insights, human-driven care."
>         - "Transforming mental health care with technology and empathy."
> 
> 3. **Digital Marketing Strategies**
>     1. **Content Marketing:**
>         - **Blog:** Regular posts on mental health topics, success stories, and expert advice.
>         - **Video Content:** Tutorials, user testimonials, and interviews with mental health professionals.
>         - **Social Media:** Engage users with motivational quotes, mental health tips, and interactive content on platforms like Instagram, Facebook, and Twitter.
>     2. **Search Engine Optimization (SEO):**
>         - Optimize the website with relevant keywords such as "AI mental health," "personalized therapy," and "mindfulness exercises."
>         - Create high-quality backlinks and improve site speed and mobile friendliness.
>     3. **Pay-Per-Click (PPC) Advertising:**
>         - Run targeted ad campaigns on Google and social media platforms.
>         - Use retargeting strategies to convert website visitors into users.
> 
> 4. **Partnerships and Collaborations**
>     1. **Collaborate with Mental Health Professionals:**
>         - Partner with licensed therapists to offer combined AI and human therapy sessions.
>         - Create a referral program for therapists to recommend MindWell AI to their clients.
>     2. **Corporate Wellness Programs:**
>         - Offer tailored packages for businesses to provide MindWell AI to their employees.
>         - Highlight benefits such as improved employee well-being and productivity.
>     3. **Academic and Research Partnerships:**
>         - Collaborate with universities and research institutions to validate the efficacy of AI-driven mental health interventions.
>         - Publish research findings to build credibility and trust.
> 
> 5. **Community Engagement and User Support**
>     1. **Online Community Building:**
>         - Create forums and support groups within the platform for users to share experiences and support each other.
>         - Host regular virtual events, webinars, and Q&A sessions with mental health experts.
>     2. **Exceptional Customer Support:**
>         - Offer 24/7 customer support via chat, email, and phone.
>         - Provide comprehensive onboarding and continuous assistance to ensure users maximize the platform's benefits.
> 
> 6. **Influencer and Advocacy Marketing**
>     1. **Influencer Partnerships:**
>         - Collaborate with mental health influencers and bloggers to reach a wider audience.
>         - Use authentic reviews and endorsements to build trust and credibility.
>     2. **User Advocacy:**
>         - Encourage satisfied users to share their success stories and experiences on social media.
>         - Create a referral program rewarding users for bringing new members to the platform.
> 
> 7. **Data-Driven Strategies and Continuous Improvement**
>     1. **Analytics and Feedback:**
>         - Use analytics to track user behavior, engagement, and satisfaction.
>         - Regularly gather user feedback to identify areas for improvement and new feature development.
>     2. **Adaptive AI:**
>         - Continuously update the AI algorithms based on user interactions and feedback to enhance personalization and effectiveness.
> 
> **Conclusion**
> 
> MindWell AI is poised to revolutionize mental health care by leveraging the power of AI to provide personalized, accessible, and compassionate support. Through strategic marketing, community engagement, and continuous innovation, MindWell AI will not only reach those in need but also create a lasting impact on the mental well-being of its users. Together, we can foster a world where mental health is prioritized, accessible, and stigma-free.
> 
> "Join us in transforming mental health care—one mind at a time."

#### API example
```python
from openai import OpenAI

# Set your API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

prompt = "In a persuasive and motivational style outline a marketing strategy for a new tech startup, MindWell AI. MindWell AI is a personalized mental health and wellness platform that leverages artificial intelligence to provide users with tailored mental health resources, therapy sessions, mindfulness exercises, and daily well-being check-ins. The platform offers a combination of AI-driven chatbots for initial interactions and licensed therapists for more in-depth sessions."

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": prompt}
  ]
)

# Print the response from the model
print(completion.choices[0].message.content)
```