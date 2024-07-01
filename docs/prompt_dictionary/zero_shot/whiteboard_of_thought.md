## Whiteboard-of-Thought (WoT)
Whiteboard-of-Thought is a technique that leverages the visual reasoning capabilities of multimodal large language models (MLLMs) by allowing them to create and process visual aids during the reasoning process. This method is particularly useful for tasks that humans typically solve using visual thinking, such as spatial reasoning, diagram interpretation, and problem-solving that benefits from visual representation.

### How to use it
To use Whiteboard-of-Thought, provide the MLLM with a query and instruct it to create visualizations using Python libraries like Matplotlib or Turtle. The model then generates code to create the visual, which is executed to produce an image. This image is then fed back to the model for further reasoning or to produce a final answer.

See "Prompting" section for usage details.

### When to use it
!!! tip "When to use Whiteboard-of-Thought"
- Ideal for tasks that involve visual or spatial reasoning, such as understanding ASCII art, solving geometric problems, or navigating spatial structures.
- Effective in situations where creating a visual representation can simplify complex information or relationships.
- Particularly useful for queries that humans would typically solve by drawing diagrams or sketches.
- May have limited pratical applications (see "What to watch out for").

### What to know
WoT empowers MLLMs to create and reason with explicit visuals, similar to how humans might use a whiteboard to solve problems. By generating code to create visualizations and then processing these visuals, MLLMs can unlock capabilities resembling visual thinking. This process involves three main steps: generating visualization code, executing the code to create an image, and using the MLLM's multimodal input capacity to process the resulting image.
To ensure optimal performance, clear instructions should be provided to the model for both the code generation and image interpretation steps. The choice of visualization library (e.g., Matplotlib, Turtle) should be appropriate for the task at hand.

### Best practices
!!! tip "Best practices for Whiteboard-of-Thought"
- Provide clear instructions for both code generation and image interpretation steps (see model templates and replication example below).

### What to watch out for
!!! warning "What to watch out for with Whiteboard-of-Thought"
- WoT requires a multimodal model with vision, coding, and language capabilities.
- Vision models may increase cost, check your model's token cost for vision.
- WoT demonstrates multimodal model flexibility, but it may be hard to find practical use cases.
- WoT requires manual intervention to run the returned code, or advanced coding enviornments that can safetly process third-party code while ensuring system security. Manual intervention may be especially burdensome if WoT is used at scale.
- WoT may not work in all scenarios (see above examples).

### Citations
Menon, S., Zemel, R., & Vondrick, C. (2024). Whiteboard-of-Thought: Thinking Step-by-Step Across Modalities. arXiv preprint [arXiv:2406.14562](https://arxiv.org/abs/2406.14562).

### Prompting
The WoT prompt template instructs the model to create visualizations using Python libraries and then interpret these visuals to answer the query. The template consists of two main parts:

Instructions for visualization creation:

Specify the Python library to use (e.g., Matplotlib, Turtle)
Provide any necessary constraints or specifications for the visualization


Instructions for visual interpretation:

Ask the model to analyze the generated image
Request a final answer or further reasoning based on the visual



Prompt template

> You write code to create visualizations using the {Matplotlib/Turtle} library in Python, which the user will run and provide as images. Do NOT produce a final answer to the query until considering the visualization.
> Query: {original query}
> Create a visualization to help answer this query.