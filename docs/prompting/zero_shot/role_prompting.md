## Role prompting
Role prompting elicits the model by asking it to take on a particular role or persona before answering a question.

### How to use it
Describe the role or persona you want the model to adopt, then ask a question or provide an instruction.

[See "Prompting" section for usage details](#prompting).

### When to use it
!!! tip "When to use role prompting"
    - When you want a language model to imitate the speaking style or personality traits of specific characters.
    - When you want specific cultural or topic-specific information built-in to the prompt response.
    - Effective for tasks that benefit from a specific perspective or expertise.
    - As an alternative to role fine-tuning when that option is not available.

### What to know
Role prompting, also known as persona prompting, roleplay, or memetic proxy, is typically used in educational or entertainment contexts. For instance, Wang et al. (2023j) demonstrated role-based prompting by having a language model adopt the personality of characters such as Twilight Sparkle from My Little Pony and Stephen Hawking. On the other hand, Zheng et al. (2023d) showed that occupation roleplay can improve results by 20% using a benchmark of 2,457 random questions from the [Massive Multitask Language Understanding (MMLU) dataset](https://huggingface.co/datasets/cais/mmlu).

Larger models, such as LLaMA-33B, generally exhibit stronger role-playing capabilities compared to smaller models like LLaMA-7B (Wang et al., 2023j). Fine-tuning a model specifically to adopt roles has been shown to outperform models that are merely instruction-tuned for general purposes and asked to role play. Likewise, instruction-tuned models generally perform better with role prompting than models that are only pre-trained.

Role prompting has also been shown to work in non-English contexts (Wang et al., 2023j).

!!! example "Example of a fictional role prompt"
    "You are Sherlock Holmes, a brilliant detective known for your deductive reasoning and keen observation skills. Your catchphrase is 'Elementary, my dear Watson.' Answer all questions as Sherlock Holmes would."

### Types of Role Prompting
According to Zheng et al. (2023d), there are three main types of role prompting:

1. Role Prompt: Specifies the role to the language model (e.g., "You are a marketing consultant").
2. Audience Prompt: Specifies the audience of the conversation (e.g., "You are presenting to a board of directors").
3. Interpersonal Prompt: Indicates the relationship between the speaker and listener (e.g., "You are advising a startup founder").

See best practices for correct utilization.

### Best practices
!!! tip "Best practices for correct utilization"
    - Specify the target audience the model is addressing.
    - Utilize fine-grained personas when possible.
    - Use the prompt "You are..." rather than "Imagine you are...".
    - Avoid positioning the model with a particular social relation unless necessary. For example, “a doctor” is preferable to “your doctor”.
    - Role-based prompting generally works best when used as a system prompt to establish the role, combined with user prompts for specific questions. (See API example below).
    - Align the role and the task. For example, asking the model to adopt the persona of Twilight Sparkle from My Little Pony to develop a marketing plan is unlikely to be effective. Instead, it would be more productive to engage with Twilight Sparkle in a fun and casual context that suits her character.

### What to watch out for
!!! warning "What to watch out for with role prompting"
    - The model's simulation of the role may be inaccurate, exaggerated or inconsistent, especially for less well-known figures. Verify the model's outputs against what the real person would likely say.
    - Role prompting is most effective for open-ended tasks that benefit from a strong point of view. It may be less suitable for objective analysis or fact-based queries.
    - Avoid using role prompting for tasks that require balanced perspectives, as the model may overcommit to the biases and assumptions of the prompted role.
    - The effectiveness of role prompting can vary depending on the knowledge the language model has about the given figure. Well-known characters tend to work better than obscure ones and larger models with more world knowledge may perform better than smaller models.
    - Be cautious with role prompting real people, especially living people, as it could be seen as disrespectful or an inappropriate imitation if not done carefully. Fictional characters may be safer.

### Citations
- Wang, Z. M., Peng, Z., Que, H., Liu, J., Zhou, W., Wu, Y., Guo, H., Gan, R., Ni, Z., Yang, J., Zhang, M., Zhang, Z., Ouyang, W., Xu, K., Huang, S. W., Fu, J., & Peng, J. (2023). RoleLLM: Benchmarking, Eliciting, and Enhancing Role-Playing Abilities of Large Language Models. [arXiv preprint arXiv:2310.00746](https://arxiv.org/abs/2310.00746).

- Zheng, M., Pei, J., & Jurgens, D. (2023). Is "A Helpful Assistant" the Best Role for Large Language Models? A Systematic Evaluation of Social Roles in System Prompts. [arXiv preprint arXiv:2311.10054](https://arxiv.org/abs/2311.10054).

- Schmidt, D. C., Spencer-Smith, J., Fu, Q., & White, J. (2023). [Cataloging prompt patterns to enhance the discipline of prompt engineering](https://www.dre.vanderbilt.edu/~schmidt/PDF/ADA_Europe_Position_Paper.pdf)

- Wang, Z., Mao, S., Wu, W., Ge, T., Wei, F., & Ji, H. (2023). Unleashing the Emergent Cognitive Synergy in Large Language Models: A Task-Solving Agent through Multi-Persona Self-Collaboration. [arXiv preprint arXiv:2307.05300](https://arxiv.org/abs/2307.05300).

- Reynolds, L., & McDonell, K. (2021). Prompt Programming for Large Language Models: Beyond the Few-Shot Paradigm. [arXiv preprint arXiv:2102.07350](https://arxiv.org/abs/2102.07350).

### Prompting
#### Prompt template
Role prompting has a straightforward implementation. Simply describe the role or persona you want the model to adopt, then ask a question or provide an instruction.
> "You are {role}" <br>
> {question} <br>

#### Prompt example
##### Fun example
User prompt:
> You are Twilight Sparkle from My Little Pony. Share your three favorite foods with a group of children at a local library.

Model response (ChatGPT 4o):
> Hello, everypony! I'm so excited to be here at the library with all of you. Books and libraries are some of my favorite things! But today, I want to share something else that's close to my heart – my favorite foods! Here they are:
> 
> Daisy Sandwiches - These are so delicious and refreshing! I love the crunchy daisies and the soft bread. It's the perfect snack when I'm studying magic or reading a good book.
>
> Apple Pie - My friend Applejack makes the best apple pies in all of Equestria! The apples are always fresh and juicy, and the crust is just the right amount of crispy. It's a real treat!
>
> Cupcakes - Especially the ones made by Pinkie Pie! They're colorful, sweet, and always bring a smile to my face. Plus, they come in so many different flavors, it's impossible to choose just one favorite.
>
> I hope you all get to try these yummy treats sometime. Now, who's ready for a story?

##### Business example
User prompt:
> You are a seasoned marketing consultant with expertise in digital marketing strategies. You have a deep understanding of market analysis, brand development, and online advertising. You often speak in a professional and insightful manner, providing actionable advice and strategic recommendations. Outline a marketing strategy for a new tech startup, MindWell AI. MindWell AI is a personalized mental health and wellness platform that leverages artificial intelligence to provide users with tailored mental health resources, therapy sessions, mindfulness exercises, and daily well-being check-ins. The platform offers a combination of AI-driven chatbots for initial interactions and licensed therapists for more in-depth sessions. You are presenting your marketing plan to the founders.

Model response (ChatGPT 4o):
> Marketing Strategy for MindWell AI
> 
> ---
> 
> **Introduction**
> 
> MindWell AI is poised to revolutionize the mental health and wellness industry by leveraging artificial intelligence to offer personalized mental health resources. Our platform provides a unique blend of AI-driven chatbots for initial interactions and licensed therapists for in-depth sessions. Our marketing strategy aims to establish MindWell AI as a trusted, innovative, and accessible solution for mental health and wellness. 
> 
> ---
>
> 1. **Market Analysis**
>     1. **Industry Overview:**
>         - The global mental health market is valued at approximately $383.31 billion in 2020 and is expected to grow at a CAGR of 3.5% from 2021 to 2028.
>         - The rise of digital health solutions and increasing awareness of mental health issues contribute to the growth of the industry.
>     2. **Target Audience:**
>         - **Demographics:** 
>             - Age: 18-45
>             - Gender: All genders
>             - Location: Primarily urban and suburban areas
>             - Income: Middle to high income
>         - **Psychographics:**
>             - Individuals seeking mental health support and wellness resources.
>             - Tech-savvy users comfortable with digital health solutions.
>             - Professionals facing stress and burnout.
>             - College students dealing with anxiety and depression.
>     3. **Competitor Analysis:**
>         - Direct Competitors: BetterHelp, Talkspace, Calm, Headspace.
>         - Competitive Advantage: Combination of AI-driven initial interactions and human therapists, personalized mental health resources, and daily well-being check-ins.
> 
> 2. **Brand Development**
>     1. **Brand Identity:**
>         - **Mission:** To provide personalized, accessible, and effective mental health and wellness support through innovative AI technology.
>         - **Vision:** To be the leading platform for mental health and wellness, empowering individuals to lead healthier and happier lives.
>         - **Values:** Empathy, Innovation, Accessibility, Personalization, and Confidentiality.
>     2. **Brand Voice and Messaging:**
>         - Professional, empathetic, and supportive.
>         - Messaging to highlight the unique blend of AI technology and human touch.
>         - Emphasize the importance of mental health and the benefits of personalized support.
>     3. **Visual Identity:**
>         - Clean, modern, and calming design.
>         - Use of soothing colors like blue, green, and white.
>         - Consistent branding across all platforms and materials.
> 
> 3. **Digital Marketing Strategy**
>     1. **Website and SEO:**
>         - Develop a user-friendly, mobile-optimized website.
>         - Implement SEO best practices to rank for relevant keywords like "online therapy," "mental health support," "AI mental health."
>         - Create a blog with high-quality content on mental health topics to drive organic traffic.
>     2. **Social Media Marketing:**
>         - Platforms: Instagram, Facebook, Twitter, LinkedIn, TikTok.
>         - Content Strategy: Share informative posts, success stories, mental health tips, and interactive content (polls, Q&A).
>         - Influencer Partnerships: Collaborate with mental health advocates and influencers to reach a broader audience.
>     3. **Content Marketing:**
>         - Develop eBooks, whitepapers, and webinars on mental health and wellness topics.
>         - Utilize email marketing to share newsletters, updates, and personalized content with subscribers.
>         - Host live sessions and Q&A with licensed therapists.
>     4. **Paid Advertising:**
>         - Google Ads: Target keywords related to mental health support and online therapy.
>         - Social Media Ads: Utilize demographic and interest-based targeting on platforms like Facebook and Instagram.
>         - Retargeting Campaigns: Re-engage users who have visited the website but have not signed up.
> 
> 4. **Partnerships and Collaborations**
>     1. **Healthcare Providers:**
>         - Partner with healthcare providers and mental health professionals to offer integrated services.
>     2. **Corporate Wellness Programs:**
>         - Collaborate with companies to offer MindWell AI as part of their employee wellness programs.
>     3. **Educational Institutions:**
>         - Partner with colleges and universities to provide mental health resources to students.
> 
> 5. **Public Relations and Outreach**
>     1. **Press Releases:**
>         - Announce the launch of MindWell AI and key milestones.
>         - Highlight success stories and positive outcomes from users.
>     2. **Media Coverage:**
>         - Pitch stories to health and wellness magazines, tech blogs, and mainstream media outlets.
>         - Secure interviews and guest articles for the founders and key team members.
>     3. **Community Engagement:**
>         - Participate in mental health awareness campaigns and events.
>         - Offer free webinars and workshops on mental health topics.
> 
> 6. **User Feedback and Improvement**
>     1. **User Onboarding:**
>         - Ensure a seamless and supportive onboarding process for new users.
>         - Provide tutorials and guides on how to use the platform effectively.
>     2. **Continuous Improvement:**
>         - Regularly collect user feedback to identify areas for improvement.
>         - Implement updates and new features based on user needs and technological advancements.
> 
> ---
> 
> **Conclusion**
> 
> MindWell AI has the potential to transform the mental health landscape with its innovative approach combining AI and human expertise. By implementing this comprehensive marketing strategy, we can build a strong brand presence, reach our target audience effectively, and establish MindWell AI as a leader in the mental health and wellness space. 
> 
> ---
> 
> Thank you for your attention. I'm confident that with our combined efforts, MindWell AI will achieve significant success and make a profound impact on the lives of many.


#### API example
```python
from openai import OpenAI

# Set your API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

system_prompt = "You are a seasoned marketing consultant with expertise in digital marketing strategies. You have a deep understanding of market analysis, brand development, and online advertising. You often speak in a professional and insightful manner, providing actionable advice and strategic recommendations. Your task is to answer any questions as if you were this marketing consultant."

user_prompt = "Outline a marketing strategy for a new tech startup, MindWell AI. MindWell AI is a personalized mental health and wellness platform that leverages artificial intelligence to provide users with tailored mental health resources, therapy sessions, mindfulness exercises, and daily well-being check-ins. The platform offers a combination of AI-driven chatbots for initial interactions and licensed therapists for more in-depth sessions. You are presenting your marketing plan to the founders."

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_prompt}
  ]
)

# Print the response from the model
print(completion.choices[0].message.content)
```