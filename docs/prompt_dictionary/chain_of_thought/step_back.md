---
date: 6 July 2024
---

## Step-Back Prompting
Step-Back Prompting is a technique that enables large language models (LLMs) to perform abstractions to derive high-level concepts and first principles from instances containing specific details. By using these concepts and principles to guide reasoning, LLMs can significantly improve their abilities in following a correct reasoning path towards a solution.

### First proposed
Step-Back Prompting was proposed in March 2024 by Huaixiu Steven Zheng, Swaroop Mishra, Xinyun Chen, Heng-Tze Cheng, Ed H. Chi, Quoc V Le, and Denny Zhou in the paper "Take a Step Back: Evoking Reasoning via Abstraction in Large Language Models."

### How to use it
Step-Back Prompting involves two main steps when interacting with an LLM:
1. The step-back prompt
- Prompt the language model with a step-back question asking it to reason about the principles at play in a solutoin rather than the solution itself.
- Have the LLM retrieve relevant facts about the high-level concept or principle.

2. The solution prompt
- Pass the principles from the step-back prompt along with the original question to the language model.
- Have the model produce a final solution.

See "Prompting" and "Code example" sections for usage details.

### When to use it
!!! tip "When to use Step-Back Prompting"
    - Ideal for complex tasks that benefit from abstracting to higher-level concepts or principles before reasoning about specifics.
    - Effective for knowledge-intensive questions where retrieving general information first can help guide the specific answer.
    - Particularly useful for multi-step reasoning tasks where breaking down the problem into abstract concepts can simplify the reasoning process.
    - Applicable across various domains including STEM, knowledge QA, and multi-hop reasoning tasks.

### What to know
Step-Back Prompting aims to mimic the human cognitive process of stepping back to consider higher-level concepts when faced with challenging tasks. This method involves two key steps:
Abstraction: The LLM generates a more abstract or high-level question related to the original query.
Reasoning: The LLM uses the information from the abstract question to guide its reasoning on the original query.
The authors demonstrated significant performance improvements across various tasks:

MMLU Physics: +7% improvement
MMLU Chemistry: +11% improvement
TimeQA: +27% improvement
MuSiQue: +7% improvement

The technique was shown to be effective across different model families, including PaLM-2L, GPT-4, and Llama2-70B.

### Best practices
!!! tip "Best practices for Step-Back Prompting"
    - Provide clear instructions for both the abstraction and reasoning steps.
    - Use few-shot examples to demonstrate the desired abstraction and reasoning process.
    - Consider combining Step-Back Prompting with other techniques like retrieval-augmented generation (RAG) for knowledge-intensive tasks.
    - Implement error handling and validation to manage potential issues in the abstraction or reasoning steps.
    - Ensure that the abstraction step doesn't introduce errors or biases not present in the original query.

### What to watch out for
!!! warning "What to watch out for with Step-Back Prompting"
    - The quality of the abstraction can significantly impact the final answer. Poor abstractions may lead to irrelevant or misleading reasoning.
    - Some simple queries may not benefit from abstraction and could be answered more efficiently directly.
    - The technique may require more computation time and resources compared to direct questioning, especially for complex tasks.
    - Performance improvements may vary depending on the specific task and model used.
    - There's a risk of over-abstraction, potentially losing important details from the original query.

### Citations
Zheng, H. S., Mishra, S., Chen, X., Cheng, H. T., Chi, E. H., Le, Q. V., & Zhou, D. (2024). Take a Step Back: Evoking Reasoning via Abstraction in Large Language Models. arXiv preprint arXiv:2310.06117v2.

### Prompting
The Step-Back Prompting template instructs the model to first generate a more abstract question related to the original query, and then use this abstraction to guide its reasoning. The template consists of two main parts:
Instructions for abstraction:

Ask the model to generate a more general or high-level question related to the original query.

Instructions for reasoning:

Instruct the model to use the information from the abstract question to answer the original query.

Prompt template
PROMPT 1:
You are an expert at [domain]. Your task is to step back and paraphrase a question to a more generic step-back question, which is easier to answer. Here are a few examples:
Original Question: [Example Original Question 1]
Stepback Question: [Example Stepback Question 1]
[Additional examples as needed]
Original Question: [Original Question]
Stepback Question:
PROMPT 2:
You are an expert of [domain]. I am going to ask you a question. Your response should be comprehensive and not contradicted with the following context if they are relevant. Otherwise, ignore them if they are not relevant.
[Relevant context from original query]
[Relevant context from step-back query]
Original Question: [Original Question]
Answer: