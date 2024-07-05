---
date: 21 June 2024
---

# Creating Synthetic Apartment Reviews Dataset

## Overview
In this tutorial, we'll use a novel technique to create some basic synthetic data as an exercise in prompt engineering. The Python notebook for the project can be found on my GitHub [here](https://github.com/jjmacky/prompt-dictionary/blob/main/docs/synthetic_data/basic_tutorial_1/airbnb_rewriting.ipynb).

The goal is to create a set of realistic apartment reviews that contain the monthly price paid for the apartment. We'll use the review to populate a JSON object which includes:

- The review
- A natural language query requesting an extraction of the monthly rent price from the review
- A JSON schema corresponding to that query
- A JSON object which matches the schema and contains the rent price (can be used as a target for benchmarking or finetuning)

To achieve this, we'll take the creative approach of using a large language model to translate short-term Airbnb rental reviews into long-term apartment reviews that contain monthly pricing information from the reviewer. This exercise is based on a real-world use case. I was surprised when I searched online for apartment review datasets, but was unable to find many. One way to solve this problem would be to scrape apartment rental reviews from the web, but creating synthetic data allows us to have more control over the output. Another approach is to simply ask a language model to generate fictional reviews. However, in my experience seeding the model with a real review generates richer and more varied synthetic data. The approach used here can be extended in many ways.

Because the dataset contains both the unstructured text as well as the target output, this kind of synthetic data can be used:

- To create a data extraction benchmark to evaluate a large language model or other machine learning model (i.e. how well can a language model take a natural language query and output a correct JSON object representing the result of that query).
- To fine-tune a smaller language model on data extraction activities.
- For educational purposes, if you want to create curated dataset of unstructured text to help teach students.
- To create information-dense text that might more efficiently train a large language model.

## What the data synthetic data looks like
Let's compare the results from three different language models, all using the same process from this tutorial (see code below). As you can see, all three models did a good job of transforming the short-term Airbnb review into a realistic apartment review.

### Original Airbnb review
> "Frans was a wonderful host.  He picked us up from the airport, and unfortunately we had major issues with our flight and he waited an hour for us at the airport!  The houseboat was very clean and comfortable.  It had all the amenities you would need and he did a great job of explaining everything to us.  There are lots of resources in the houseboat to help you navigate Amsterdam, but Frans also stays directly beside the houseboat.  It was reassuring knowing he was there in case we needed anything.  Even though it rained during our short stay, we loved the location.  It's easy access to the tram and to a grocery store, but it is away from the hustle and bustle of the city.  It's a beautiful and serene place.  When we left, Frans gave us an adorable souvenir.  We accidentally left our converter charger at the houseboat, and he rushed it to us while we were waiting on our tram.  Great host, great place, and I highly recommend it."

### GPT-4o rewritten review
The code used in this tutorial leverages the GPT-4o API. Of the three models, GPT-4o is the only one that didn't incorporate the forgotten power converter into the review.
> "Living on this houseboat was an exceptional experience. It was very clean and comfortable, with all the amenities you could need. The houseboat is situated in a beautiful and serene location, away from the hustle and bustle of the city, yet with easy access to the tram and a grocery store nearby. The atmosphere was peaceful, making it an ideal place to call home. The landlord was incredibly considerate, even leaving an adorable souvenir for us when we first moved in. There were plenty of resources available in the houseboat to help navigate Salem and the surroundings. The price at $2690 per month felt justified for such a unique living experience in this charming city. Even when it rained, the location remained lovely, and we thoroughly enjoyed our time there. Highly recommend considering this place for those looking for a distinctive and tranquil residence."

### Claude Sonnet 3.5 rewritten review
Of the three models, I prefer Claude Sonnet 3.5's interpretation the most.
> "This houseboat apartment has been a gem! The location is perfect - easy access to public transportation and a nearby grocery store, but tucked away from the hustle and bustle of the city center. It's a serene and beautiful place to call home. The apartment itself is very clean, comfortable, and has all the amenities one could need. The landlord did an excellent job explaining everything when I first moved in. Even when minor issues arise, the landlord is always responsive and helpful. For instance, I accidentally left my converter charger in the apartment when moving out, and the landlord rushed to get it back to me before I left. Such attentive service is truly appreciated. The rent is $2690 per month, which is a fair price for the quality of living and the convenient location in Nashville. I highly recommend considering this houseboat apartment if you're looking for a unique and peaceful living experience in the city."

### Llama3 (8B) rewritten review
While the Llama3 (8B) results were good when the model returned a rewritten review, it was unreliable. Sometimes it returned the original review instead of the rewritten one, failed to incorporate the correct price, or added unnecessary leading or trailing explanatory text.
> "Frans was a wonderful landlord! He helped me settle in by explaining everything about the apartment and its amenities. The location is beautiful and serene, with easy access to public transportation and a grocery store. It's away from the hustle and bustle of the city, but still close enough to enjoy all it has to offer. I loved living here and highly recommend it! The rent was around $2690 per month, which was very reasonable considering the area and amenities. Frans even gave me an adorable souvenir when I moved out, and he went above and beyond to help me get my converter charger back after I left it behind. Overall, it's a great place to call home."


Now, let's create our synthetic data!

## Getting the Data

The Airbnb review dataset can be found on Kaggle [here](https://www.kaggle.com/datasets/muhammadahmedansari/airbnb-dataset).

## Examining the data
It's always a good idea to play around with your data first. Let's have a look.

Read in the data.


```python
import pandas as pd

# Set file path and read in AirBnb reviews
file_path = 'airbnb_reviews.csv'
df = pd.read_csv(file_path)
```

Look at the column names.


```python
# Look at column names
df.columns
```




    Index(['listing_id', 'id', 'date', 'reviewer_id', 'reviewer_name', 'comments'], dtype='object')



What does a single row look like? From looking at the output it seems "comments" is the column that contains the user reviews.


```python
# Look at the first row
df.head(1)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>listing_id</th>
      <th>id</th>
      <th>date</th>
      <th>reviewer_id</th>
      <th>reviewer_name</th>
      <th>comments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2818.0</td>
      <td>1191.0</td>
      <td>3/30/2009</td>
      <td>10952</td>
      <td>Lam</td>
      <td>Daniel is really cool. The place was nice and ...</td>
    </tr>
  </tbody>
</table>
</div>



Look at the number of rows. Almost 350,000! A lot of reviews.


```python
# Look at number of rows
print(df.shape[0])
```

    342904


Read a few sample reviews to get a feeling for things. As I did this I noticed not all reviews are in English.


```python
# Examine some random reviews
review = df.sample(1)['comments'].iloc[0]
print(review)
```

    Juliaan was a great host, check-in was very easy as he lives right above the unit. The neighborhood is excellent, we felt very safe and plenty of restaurant choices in the immediate vicinity and 15-20 minute walking distance from all the major attractions, including the train station.<br/><br/>The unit has a small refrigerator and utensils, but no actual kitchen (which we knew from the description). The neighborhood is quiet and the unit is up a few floors from the street level so noise was not an issue at all. Overall a great stay and would definitely stay there again.


Here's an example of a review in French.


```python
# Some reviews are not in English. We need to filter them out. We'll also subset to reviews that are 50 words or longer.
df.loc[97053, 'comments']
```




    'L’appartement de Thomas est situé dans un quartier sûr et tranquille, à proximité du Vondelpark, de restaurants, cafés et magasins. Il est grand, lumineux, très propre et charmant, avec une touche vintage. La cuisine est très bien équipée et les jouets des enfants sont un plus pour les familles. Thomas mérite bien son appellation de «\xa0super host\xa0». Il est très accueillant et attentionné. Les procédures de check-in et -out sont très faciles. <br/>Les familles trouveront leur bonheur dans cet appartement. '



### Filter the data
For this activity I want only reviews in English. We can use the langdetect library to detect the language of each review and remove those that aren't in English. I've also decided I want the reviews to be at least 50 words long to ensure they are more interesting and provide a good text of data extraction capabilities if used later for evaluation or fine-tuning.


```python
from langdetect import detect, LangDetectException

# Use the detect method from langdetect to create a simple English language detection function
def is_english(text):
    try:
        if detect(text) == 'en':
            return True
        else:
            return False
    except LangDetectException:
        return False

# Prep comments column
df['comments'] = df['comments'].fillna('')
df = df[df['comments'].str.len() > 0]

# Subset the df to reviews that are longer than 50 words
df['review_word_count'] = df['comments'].apply(lambda text: len(text.split())) # Review word count
df = df[df['review_word_count'] >= 50] # Subsetting

# Subset the df to reviews that are in English
df['is_english'] = df['comments'].apply(lambda text: is_english(text)) # Is review in English?
df = df[df['is_english']] # Subsetting
```

Let's look at the number of rows now. Much shorter!


```python
# Look at new shape
print(df.shape[0])
```

    92830


### Generating the synthetic data
Now let's generate our synthetic data. I started by sampling a few random rows from the dataset and selected three Airbnb reviews. I then rewrote these reviews to reflect long-term apartment rental experiences rather than short-term Airbnb stays. Initially, I used ChatGPT to assist with this task, but it struggled to produce realistic reviews until I added specific instructions and provided examples. For instance, it would use phrases like "When we first checked in," which are not typical in apartment reviews. After several iterations of refining the instructions and examples, I developed a prompt that works quite well.

Additionally, I created a function to generate rent prices. The function samples from a normal distribution but ensures the final digit matches the step size ($5 in my code) to more realistically reflect rental prices. Alternatively, you could generate prices using a straightforward method, such as sampling from a uniform distribution:

`rent_prices = random.sample(range(1000, 6000, 5), n)`

or from a normal distribution if you don't care about the rent prices having consistent final digits:

`rent_prices = np.random.normal(2500, 1000, n)`

In this example, the language model inserts only the rent price into the review. However, you could extend this approach to insert multiple pieces of information.

To increase the diversity in the synthetic dataset, I also introduced a step to replace "Amsterdam" if mentioned. It appears the original AirBnb dataset is from Amsterdam and this creates an unbalanced city distrubtion, even after having a language model rewrite the review. The logic selects a random city from a predefined list of well-known U.S. cities. Such a list is easy to create (ChatGPT printed out a list of 300 U.S. cities in a matter of seconds, which I copied and pasted into a text file). This approach enhances the variety of the synthetic data and makes it more representative of different rental markets.

Before we proceed to the actual data generation, let's look at the resulting JSON object. The JSON object consists of:

1. Review Text: The rewritten review reflecting a long-term apartment rental experience.
2. Natural Language Query: A query matching the JSON schema. In this case the query is "What was the rent price paid by this reviewer?"
3. JSON Schema: A schema I created for this activity, representing the structure we would want the model to follow for data extraction. This schema is not passed to the model but included in the final result for future benchmarking or fine-tuning.
4. Rent Price: The rent price passed to the model and included in the review. The rent is allowed to be 'NA' in which case the rewritten review won't mention the rent price. This more realistically mimics the variety of real reviews.

```python
json_object = {
    "review": rewritten_review,
    "query": "What was the rent price paid by this reviewer?",
    "json_schema": {
        "type": "object",
        "properties": {
            "rent_price": {
                "type": "integer",
                "description": "Price paid by users or 'NA' if not mentioned."
            }
        },
        "required": ["rent_price"]
    }, 
    "expected_result": {
        "rent_price": rent_price
    }
}
```

These JSON objects are concatenated to create the final dataset of length n, which is a JSON file composed of these individual JSON objects.

With this setup, we're ready to generate the synthetic data.


```python
from openai import OpenAI
import numpy as np
import os
import json
import random

# Set API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY")
)

def create_apartment_review(original_review, rent_price, city):
  # This function transforms an Airbnb review into a long-term apartment review.
  # It takes the original Airbnb review and a rent price, then generates a rewritten
  # review that reflects long-term living in an apartment. The transformed review
  # avoids language specific to short-term stays and replaces mentions of the host 
  # with details about the apartment, building, or area. Additionally, it incorporates
  # the rent price naturally within the review. If the rent price is 'NA', then rent 
  # won't be mentioned. This more realistically mirrors the fact that not all reviews 
  # mention rent. These reviews are from Amsterdam and many reviews mention the city. 
  # Therefore, I created logic to replace Amsterdam with a random U.S. city to get more 
  # diversity in the data.

  # Construct the prompt for the language model
  prompt = f"""
    Your task is to transform Airbnb reviews into long-term apartment reviews. Imagine the tenant lived in the apartment for somewhere between one and five years. Ensure that the rewritten reviews reflect long-term living, avoiding short-term stay language like "When we checked in." The language should convey that the tenant had control over decoration and furniture.

    Most Airbnb reviews mention the host, but that is uncommon in apartment reviews. Replace sentences about the host with details about the apartment, building, area, or landlord. Ensure the rewritten review feels authentic while drawing inspiration from the original Airbnb review.

    The reviews original come from Amsterdam. If the review mentions Amsterdam, replace it with the specified city.
    
    Incorporate a sentence about the price naturally within the review. Use creative and varied language when discussing the price. If the provided rent price is 'NA' the rewritten review should not mention the rent price.

    --- Example 1 ---
    Original Airbnb review: Tammy was an amazing host! One of the best Airbnb’s I have ever stayed at! Great decorations, didn’t feel like a typical airbnb rental property, bright and cozy rooms. It was very convenient and a short walk to the city center around 15-20 minutes. Reasonably priced compared to many places in Amsterdam and well worth every penny! Would definitely stay again my next visit :) Thanks again Tammy!

    Rent price: $3500
    City: Tokyo
    Rewritten review: One of the best apartments I have ever stayed at! Great decorations in the lobby and good design. It didn’t feel like a typical apartment, with bright and cozy rooms. It was very convenient and a short walk to the city center around 15-20 minutes. Rent was $3500 per month, which was reasonable compared to many places in Tokyo and well worth every penny! Would definitely recommend renting in this building if you can.
    --- End of Example 1 ---

    --- Example 2 ---
    Original Airbnb review: Beautiful home, excellent location in de Pijp with cafes and grocery store nearby, walkable to the museums and parks. A block from major tram lines. The home has tons of natural light and plants (including herbs you can use!) that warm up the place even on a dreary day in the Netherlands. Kitchen is well stocked, bed is comfortable. Jerome's a very responsive host. Highly recommend to all -- would definitely stay here my next trip!

    Rent price: 'NA'
    City: Renton
    Rewritten review: Beautiful apartment. Excellent location in de Pijp with cafes and grocery store nearby, walkable to the museums and parks. A block from major tram lines. The apartment has tons of natural light which makes it great for growing plants! My plants really warmed up the place even on a dreary day in Washington. Kitchen is large and the bedroom is spacious. Great building maintence guy! Highly recommend the building to all -- will definitely renew my lease!
    --- End of Example 2 ---

    --- Example 3 ---
    Original Airbnb review: Daan and Claire are great, we were very kindly welcomed. They provided all the necessary and useful information for our stay. There was even a delicious pie and strawberries as a welcome. It was an extremely nice touch. Their apartment is spacious, bright and in a quiet area with a few bars and restaurants. This is a lovely place a few steps from bus and tram that brings us directly to the city center. We highly recommend it !

    Rent price: $1200
    City: Tempe
    Rewritten review: Great landlord! There was even a delicious pie and strawberries as a welcome when we first moved in. It was an extremely nice touch. Their apartment is spacious, bright and in a quiet area with a few bars and restaurants. This is a lovely place a few steps from bus and tram that brings us directly to the city center. So lucky I got to live here for just 1200 bucks!
    --- End of Example 3 ---

    Original Airbnb review: {original_review}
    Rent price: {rent_price}
    City: {city}

    Rewritten review:
  """

  # Call the OpenAI API. You could use other language models as desired.
  completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
      {"role": "user", "content": prompt}
    ]
  )

  # Return the rewritten review.
  rewritten_review = completion.choices[0].message.content
  return rewritten_review

def create_rent_prices(cheapest_rent, most_expensive_rent, rent_price_step_size, n, rent_price_na_ratio):
  # Generate a list of rent prices using a normal distribution within a specified range.
  #
  # Parameters:
  # - cheapest_rent (int): The minimum rent price.
  # - most_expensive_rent (int): The maximum rent price.
  # - rent_price_step_size (int): The step size for rent prices.
  # - n (int): The number of rent prices to generate.
  # - The ratio of reviews that should have an 'NA' rent price (rent price won't be mentioned in the rewritten review.)
  #
  # Returns:
  # - list of int: A list of rent prices.

    # Calculate summary statistics used to generate the rent.
    rent_prices = []
    mean_rent = np.mean([most_expensive_rent, cheapest_rent])
    sd_of_rent_prices = (most_expensive_rent - mean_rent) / 3
    
    while len(rent_prices) < n:
        unrounded_rent = np.random.normal(mean_rent, sd_of_rent_prices)
        rent_price = rent_price_step_size * round(unrounded_rent / rent_price_step_size) # A trick to make sure the rent matches the step size

        if (rent_price <= most_expensive_rent) and (rent_price >= cheapest_rent):
            rent_prices.append(rent_price)
    
    # Replace random rent prices with NA since not every review would mention a rent price
    indicies = random.sample(range(n), k=int(n * rent_price_na_ratio))
    rent_prices = ["NA" if i in indicies else rent_prices[i] for i in range(len(rent_prices))]

    # Return the final result
    return rent_prices

def get_random_cities(city_list_file_name, n):
  # Open the random city text file and read in the data.
  with open(city_list_file_name, 'r') as file:
      cities = file.read().splitlines()
  
  # Return a random set of cities of length n.
  return np.random.choice(cities, size=n)
      
# Set up a small test
n = 5
cheapest_rent = 1000
most_expensive_rent = 5000
rent_price_step_size = 5
rent_price_na_ratio = 0.2 # What proportion of reviews shouldn't mention rent?
city_list_file_name = 'well_known_cities.txt'

original_reviews = df['comments'].sample(n, replace=True).tolist() # Get a sample of AirBnb reviews
rent_prices = create_rent_prices(cheapest_rent, most_expensive_rent, rent_price_step_size, n, rent_price_na_ratio) # Create the list of random rent prices
cities = get_random_cities(city_list_file_name, n) # Create the list of random cities

data = [] # List to store JSON results

# Loop through the lists
for original_review, rent_price, city in zip(original_reviews, rent_prices, cities):
  rewritten_review = create_apartment_review(original_review, rent_price, city)

  json_object = {
      "review": rewritten_review,
      "query": "What was the rent price paid by this reviewer?",
      "json_schema": {
          "type": "object",
          "properties": {
              "rent_price": {
                  "type": "integer",
                  "description": "Price paid by users or 'NA' if not mentioned."
              }
          },
          "required": ["rent_price"]
      },
      "expected_result": {
          "rent_price": rent_price
      }
  }
    
  data.append(json_object)

# Output the data as JSON
output_json = json.dumps(data, indent=4)

# Saving to a file (optional)
# with open('output.json', 'w') as f:
#     f.write(output_json)

print(output_json) # Display the output JSON
```

    [
        {
            "review": "The apartment was clean and in a central location right off the Red Light District. However, the street can be noisy, so ear plugs are recommended for light sleepers. The apartment only had a sink in the bedrooms, with no toilet or shower. What you see is what you get. Overall, living here was a positive experience, thanks to its convenience and the overall vibe of the neighborhood.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": "integer",
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": "NA"
            }
        },
        {
            "review": "Living on this houseboat was an exceptional experience. It was very clean and comfortable, with all the amenities you could need. The houseboat is situated in a beautiful and serene location, away from the hustle and bustle of the city, yet with easy access to the tram and a grocery store nearby. The atmosphere was peaceful, making it an ideal place to call home.\n\nThe landlord was incredibly considerate, even leaving an adorable souvenir for us when we first moved in. There were plenty of resources available in the houseboat to help navigate Salem and the surroundings. The price at $2690 per month felt justified for such a unique living experience in this charming city. Even when it rained, the location remained lovely, and we thoroughly enjoyed our time there. Highly recommend considering this place for those looking for a distinctive and tranquil residence.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": "integer",
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 2690
            }
        },
        {
            "review": "Living in this apartment has been a wonderful experience. The location is conveniently close to central station, with trams nearby for easy exploration. The apartment itself is quaint and perfect for our needs. The neighborhood is quiet, safe, and close to many events and amenities. The rent, at $2055 per month, is quite reasonable considering everything Denver has to offer. Highly recommend this place to anyone looking for a long-term rental in the area!",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": "integer",
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 2055
            }
        },
        {
            "review": "Lovely place, just make sure to check the weather before planning outdoor activities. I\u2019d still probably choose this apartment over anything else in New Orleans. The location is a bit out from the city center, so biking from downtown back home takes about 35 minutes, and it's best to avoid doing that after a few drinks. The scenery here is beautiful, and the apartment itself has a unique charm, with cheerful rooms and plenty of natural light.\n\nBreakfast is always a delight, especially if you're a fan of sheep cheese. Living in this area has its perks, especially in good weather which makes the surroundings even more enjoyable. The rent is $4150 per month, a bit on the high side, but given the ambiance and the picturesque environment, it's well worth it.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": "integer",
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 4150
            }
        },
        {
            "review": "I had a wonderful experience living in this modest but very comfortable apartment. The space was perfect for stretching out and relaxing after a busy day. The kitchen was fully equipped, making it easy to prepare home-cooked meals, which I loved. The location is incredible \u2014 with a tram stop just around the corner that takes you directly to the city centre and other tram lines. Despite its proximity to all the excitement, the neighborhood itself is quiet and relaxed, and it's right next to a beautiful park. The rent was $3080 per month, and it was well worth it for the accessibility and tranquility it offered. I would highly recommend this apartment for anyone looking to enjoy all the fun of Miramar while having a peaceful retreat to come home to.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": "integer",
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 3080
            }
        }
    ]


## Cost considerations
In a production setting, cost is a crucial factor. There are several ways to reduce costs:

1. Using a Cheaper Model: Opting for a less expensive yet equally capable model can significantly cut costs. For example, Claude Sonnet 3.5 costs $3 per million input tokens compared to GPT-4o's $5 per million input tokens.

2. Using Open Source Models: Another approach is to use open-source models like Llama3. Although testing all open-source models is beyond the scope of this activity, I tested Llama3 (8B). While the results were good when the model returned a rewritten review, it was unreliable. Sometimes it returned the original review instead of the rewritten one, failed to incorporate the correct price, or added unnecessary leading or trailing explanatory text.

3. Batch Processing: Requesting reviews in batches is another cost-saving measure. Although we still incur the input and output costs for each review, we save on the input cost of the long prompt instruction (approximately 650 words). The cost savings from this approach are calculated below:


```python
prompt_instruction_length = 650
original_review_length = 100
rewritten_review_lenth = 100
tokens_per_word_ratio = .75
input_cost_per_million_tokens = 5
output_cost_per_million_tokens = 15

# Cost to fetch a single rewritten review at a time
serial_input_cost = input_cost_per_million_tokens * ((prompt_instruction_length + original_review_length) * tokens_per_word_ratio) / 1000000
serial_output_cost = output_cost_per_million_tokens * (rewritten_review_lenth * tokens_per_word_ratio) / 1000000

print(f"Cost per rewritten review: ${serial_input_cost + serial_output_cost}") # Cost per rewritten review: $0.0039375
print(f"Total cost to generate 100,000 synthetic reviews: ${100000 * (serial_input_cost + serial_output_cost)}") # Total cost to generate 100,000 synthetic reviews: $393.75

# Cost if we request a batch of rewritten reviews
batch_size = 10
batch_input_cost = input_cost_per_million_tokens * ((prompt_instruction_length + (original_review_length * batch_size)) * tokens_per_word_ratio) / 1000000
batch_output_cost = serial_output_cost * batch_size 

print(f"Cost per rewritten review ${(batch_input_cost + batch_output_cost) / batch_size}") # Cost per rewritten review 0.00174375
print(f"Total cost to generate 100,000 synthetic reviews: ${100000 * (batch_input_cost + batch_output_cost) / batch_size}") # Total cost to generate 100,000 synthetic reviews: $174.38

# What we save by batching
batch_savings = input_cost_per_million_tokens * (tokens_per_word_ratio * prompt_instruction_length * (batch_size - 1)) / 1000000 # We only pass in the 650 word instruction prompt once and thus for batch_size - 1 we save that cost
print(f"Savings per rewritten review: ${batch_savings / batch_size }") # Savings per rewritten review: $0.00219375
print(f"Savings per 100,000 rewritten reviews: ${0.00219375 * 100000}") # $219.38

# Does our math work out?
print(f"Do these two numbers match? {(0.00174375 + 0.00219375) == 0.0039375}") # True
```

    Cost per rewritten review: $0.0039375
    Total cost to generate 100,000 synthetic reviews: $393.75
    Cost per rewritten review $0.00174375
    Total cost to generate 100,000 synthetic reviews: $174.37500000000003
    Savings per rewritten review: $0.00219375
    Savings per 100,000 rewritten reviews: $219.375
    Do these two numbers match? True


## Implementing batching
The code below modifies the base synthetic data implementation to request a batch of 10 reviews from GPT-4o. The batched response from GPT-4o appears to maintain the quality of the serial approach. Given GPT-4o's output token limit of 4096, the batch size could potentially be increased to 20 reviews at a time, introducing further savings.


```python
from openai import OpenAI
import numpy as np
import os
import json
import random

# Set API key
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY")
)

def create_apartment_reviews_batch(original_reviews, rent_prices, cities):
    # Prepare the input data for the API call
    input_data = [
        {"original_review": review, "rent_price": price, "city": city}
        for review, price, city in zip(original_reviews, rent_prices, cities)
    ]
    
    # Construct the prompt for the language model
    prompt = """
    Your task is to transform 10 Airbnb reviews into long-term apartment reviews. For each review:
    1. Imagine the tenant lived in the apartment for 1-5 years.
    2. Ensure the rewritten review reflects long-term living, avoiding short-term stay language.
    3. Replace mentions of the host with details about the apartment, building, area, or landlord.
    4. If Amsterdam is mentioned, replace it with the specified city.
    5. Incorporate the rent price naturally within the review. If the rent price is 'NA', don't mention it.

    Return a JSON object with the following structure:
    {{
        "review_1": {{ "rewritten_review": "...", "rent_price": ... }},
        "review_2": {{ "rewritten_review": "...", "rent_price": ... }},
        ...
        "review_10": {{ "rewritten_review": "...", "rent_price": ... }}
    }}

    Each "review_n" object should contain:
    - "rewritten_review": The transformed long-term apartment review as a string.
    - "rent_price": The provided rent price (as an integer or "NA" string).

    Here are the 10 reviews to transform:
    {input_data}
    """

    # Call the OpenAI API
    completion = client.chat.completions.create(
        model="gpt-4-turbo",
        response_format={ "type": "json_object" },
        messages=[{"role": "user", "content": prompt.format(input_data=json.dumps(input_data, indent=2))}]
    )

    # Parse the JSON response
    return json.loads(completion.choices[0].message.content)

def create_rent_prices(cheapest_rent, most_expensive_rent, rent_price_step_size, n, rent_price_na_ratio):
    rent_prices = []
    mean_rent = np.mean([most_expensive_rent, cheapest_rent])
    sd_of_rent_prices = (most_expensive_rent - mean_rent) / 3
    
    while len(rent_prices) < n:
        unrounded_rent = np.random.normal(mean_rent, sd_of_rent_prices)
        rent_price = rent_price_step_size * round(unrounded_rent / rent_price_step_size)

        if (rent_price <= most_expensive_rent) and (rent_price >= cheapest_rent):
            rent_prices.append(int(rent_price))  # Convert to integer
    
    indices = random.sample(range(n), k=int(n * rent_price_na_ratio))
    rent_prices = ["NA" if i in indices else rent_prices[i] for i in range(len(rent_prices))]
    return rent_prices

def get_random_cities(city_list_file_name, n):
    with open(city_list_file_name, 'r') as file:
        cities = file.read().splitlines()
    return np.random.choice(cities, size=n)

# Set up the batch process
n = 10  # Number of reviews to generate in one batch
cheapest_rent = 1000
most_expensive_rent = 5000
rent_price_step_size = 5
rent_price_na_ratio = 0.2
city_list_file_name = 'well_known_cities.txt'

original_reviews = df['comments'].sample(n, replace=True).tolist()
rent_prices = create_rent_prices(cheapest_rent, most_expensive_rent, rent_price_step_size, n, rent_price_na_ratio)
cities = get_random_cities(city_list_file_name, n)

# Generate the batch of rewritten reviews
api_response = create_apartment_reviews_batch(original_reviews, rent_prices, cities)

# Print the structure of the API response for debugging
print("API Response Structure:")
print(json.dumps(api_response, indent=2))

data = []  # List to store final JSON results

# Create JSON objects for each rewritten review
for review_key, review_data in api_response.items():
    json_object = {
        "review": review_data['rewritten_review'],
        "query": "What was the rent price paid by this reviewer?",
        "json_schema": {
            "type": "object",
            "properties": {
                "rent_price": {
                    "type": ["integer", "string"],
                    "description": "Price paid by users or 'NA' if not mentioned."
                }
            },
            "required": ["rent_price"]
        },
        "expected_result": {
            "rent_price": review_data['rent_price']
        }
    }
    data.append(json_object)

# Output the data as JSON
output_json = json.dumps(data, indent=4)

# Saving to a file (optional)
# with open('output.json', 'w') as f:
#     f.write(output_json)

print(output_json)  # To display the output JSON
```

    API Response Structure:
    {
      "review_1": {
        "rewritten_review": "Living in this Augusta apartment for the past few years has been a delight. The apartment itself is spacious, exceptionally clean, and well-decorated, creating a warm and welcoming environment. What's more, it is conveniently located just a 15-minute walk from the city center, making daily commutes and leisure activities easily accessible. The building management is very understanding and flexible about tenancy issues, which is a breath of fresh air. For a monthly rent of $2825, the value provided is outstanding. I wholeheartedly recommend this apartment for anyone looking to settle down in Augusta.",
        "rent_price": 2825
      },
      "review_2": {
        "rewritten_review": "Having lived in this Las Cruces apartment for over four years, its value really stands out, especially at $4420 per month. While slightly outside the city center, the nearby tram stop offers easy access to downtown. The apartment, though compact, is perfectly suited for busy individuals who spend most of their time out and about. The neighborhood is quiet and the building includes great amenities like provided breakfasts, adding a touch of convenience to everyday living. I can certainly recommend this place for anyone looking for long-term accommodation in Las Cruces with all necessities on hand.",
        "rent_price": 4420
      },
      "review_3": {
        "rewritten_review": "Our long-term stay in Arlington at this apartment has been highly pleasant. The room mimics just what was shown in originating ads - comfortable and welcoming. The neighborhood is friendly, giving off a lovely suburban vibe. Moreover, the building is well-managed, and the landlord personally made sure our move-in and checkout processes over the years were smooth, even driving us to the airport when we finally moved out. With a monthly rent of $2495, the value is excellent. I highly recommend this place to anyone moving to Arlington.",
        "rent_price": 2495
      },
      "review_4": {
        "rewritten_review": "Living on a houseboat in Coral Springs has been an unparalleled experience. The locality is serene, nestled close to various attractions without being swamped by tourists. The boat itself is spotless and makes you feel right at home from the get-go. Waking up to the stunning waterfront views each morning has been a real pleasure. The neighbors are very sociable and always ready with a recommendation or two about local spots. If you're seeking an extraordinary home, this is where your search should end!",
        "rent_price": "NA"
      },
      "review_5": {
        "rewritten_review": "Our family found the perfect long-term home in North Charleston in this apartment. Despite our initial concern about space for our three teenagers, the apartment fit our needs beautifully. Just a 20-minute tram ride to the city and proximity to markets and restaurants, have added to our convenience greatly. For a rent of $2220 per month, this apartment has exceeded our expectations and I'd recommend it especially for families considering a move here.",
        "rent_price": 2220
      },
      "review_6": {
        "rewritten_review": "Residing in this welcoming Mission Viejo neighborhood for a couple of years now, I've found it easy to travel to surrounding cities for day trips. The local bar offers a fine selection of craft beers, and there is convenient parking at the building. The area is quaint, safe, and surrounded by friendly faces. It\u2019s a fantastic location if you're looking for a hub without the city bustle.",
        "rent_price": "NA"
      },
      "review_7": {
        "rewritten_review": "Renting this spacious property in Pearland has been perfect for us a large group. The common rooms are expansive and the kitchen keeps us from feeling crowded, ideal for gatherings and daily life alike. Despite the smaller sleeping quarters, they're well-maintained and clean. Standing about 30 minutes from central transit hubs but easily reachable by local buses, the location balances calm residential vibes with good connectivity. At a monthly rent of $4090, it's a great spot for anyone looking for ample space in Pearland.",
        "rent_price": 4090
      },
      "review_8": {
        "rewritten_review": "Living in Kent for the past few years, this apartment has been a gem. Its fabulous location near the center and scenic parks, coupled with exquisite interior decor that makes every day a bit more special, has made long-term living here utterly enjoyable. Renting here for $3460 a month has been well worth it due to the combination of an artistic living space and essential flexibility offered by the management regarding lease terms. I highly recommend it for anyone looking to move to Kent.",
        "rent_price": 3460
      },
      "review_9": {
        "rewritten_review": "Being a resident in this Wilmington apartment has added a beautiful chapter to my life. The room, aesthetically pleasing and immaculately clean, aligned perfectly with how it was presented. The city's diversity and lively culture, coupled with the friendliness and kindness of the building manager, have made this stay nothing short of awesome. Given these benefits, the rent of $3020 per month feels justified and well-spent. I highly recommend experiencing living here.",
        "rent_price": 3020
      },
      "review_10": {
        "rewritten_review": "Our long-term stay in this quaint older apartment in Mesquite has been thoroughly delightful. Easy access to the city center combined with features suitable for taller individuals have made it a comfortable abode. The rooftop garden, despite the cold weather, remains a cherished spot. While the apartment has a more personal, lived-in feel rather than a 'professional' setup, it adds to the charm. The local neighborhood is helpful, and there's a convenient street map available from the landlord. Beautiful, charming, and priced at $3095 per month, it's been perfect for us.",
        "rent_price": 3095
      }
    }
    [
        {
            "review": "Living in this Augusta apartment for the past few years has been a delight. The apartment itself is spacious, exceptionally clean, and well-decorated, creating a warm and welcoming environment. What's more, it is conveniently located just a 15-minute walk from the city center, making daily commutes and leisure activities easily accessible. The building management is very understanding and flexible about tenancy issues, which is a breath of fresh air. For a monthly rent of $2825, the value provided is outstanding. I wholeheartedly recommend this apartment for anyone looking to settle down in Augusta.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 2825
            }
        },
        {
            "review": "Having lived in this Las Cruces apartment for over four years, its value really stands out, especially at $4420 per month. While slightly outside the city center, the nearby tram stop offers easy access to downtown. The apartment, though compact, is perfectly suited for busy individuals who spend most of their time out and about. The neighborhood is quiet and the building includes great amenities like provided breakfasts, adding a touch of convenience to everyday living. I can certainly recommend this place for anyone looking for long-term accommodation in Las Cruces with all necessities on hand.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 4420
            }
        },
        {
            "review": "Our long-term stay in Arlington at this apartment has been highly pleasant. The room mimics just what was shown in originating ads - comfortable and welcoming. The neighborhood is friendly, giving off a lovely suburban vibe. Moreover, the building is well-managed, and the landlord personally made sure our move-in and checkout processes over the years were smooth, even driving us to the airport when we finally moved out. With a monthly rent of $2495, the value is excellent. I highly recommend this place to anyone moving to Arlington.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 2495
            }
        },
        {
            "review": "Living on a houseboat in Coral Springs has been an unparalleled experience. The locality is serene, nestled close to various attractions without being swamped by tourists. The boat itself is spotless and makes you feel right at home from the get-go. Waking up to the stunning waterfront views each morning has been a real pleasure. The neighbors are very sociable and always ready with a recommendation or two about local spots. If you're seeking an extraordinary home, this is where your search should end!",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": "NA"
            }
        },
        {
            "review": "Our family found the perfect long-term home in North Charleston in this apartment. Despite our initial concern about space for our three teenagers, the apartment fit our needs beautifully. Just a 20-minute tram ride to the city and proximity to markets and restaurants, have added to our convenience greatly. For a rent of $2220 per month, this apartment has exceeded our expectations and I'd recommend it especially for families considering a move here.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 2220
            }
        },
        {
            "review": "Residing in this welcoming Mission Viejo neighborhood for a couple of years now, I've found it easy to travel to surrounding cities for day trips. The local bar offers a fine selection of craft beers, and there is convenient parking at the building. The area is quaint, safe, and surrounded by friendly faces. It\u2019s a fantastic location if you're looking for a hub without the city bustle.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": "NA"
            }
        },
        {
            "review": "Renting this spacious property in Pearland has been perfect for us a large group. The common rooms are expansive and the kitchen keeps us from feeling crowded, ideal for gatherings and daily life alike. Despite the smaller sleeping quarters, they're well-maintained and clean. Standing about 30 minutes from central transit hubs but easily reachable by local buses, the location balances calm residential vibes with good connectivity. At a monthly rent of $4090, it's a great spot for anyone looking for ample space in Pearland.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 4090
            }
        },
        {
            "review": "Living in Kent for the past few years, this apartment has been a gem. Its fabulous location near the center and scenic parks, coupled with exquisite interior decor that makes every day a bit more special, has made long-term living here utterly enjoyable. Renting here for $3460 a month has been well worth it due to the combination of an artistic living space and essential flexibility offered by the management regarding lease terms. I highly recommend it for anyone looking to move to Kent.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 3460
            }
        },
        {
            "review": "Being a resident in this Wilmington apartment has added a beautiful chapter to my life. The room, aesthetically pleasing and immaculately clean, aligned perfectly with how it was presented. The city's diversity and lively culture, coupled with the friendliness and kindness of the building manager, have made this stay nothing short of awesome. Given these benefits, the rent of $3020 per month feels justified and well-spent. I highly recommend experiencing living here.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 3020
            }
        },
        {
            "review": "Our long-term stay in this quaint older apartment in Mesquite has been thoroughly delightful. Easy access to the city center combined with features suitable for taller individuals have made it a comfortable abode. The rooftop garden, despite the cold weather, remains a cherished spot. While the apartment has a more personal, lived-in feel rather than a 'professional' setup, it adds to the charm. The local neighborhood is helpful, and there's a convenient street map available from the landlord. Beautiful, charming, and priced at $3095 per month, it's been perfect for us.",
            "query": "What was the rent price paid by this reviewer?",
            "json_schema": {
                "type": "object",
                "properties": {
                    "rent_price": {
                        "type": [
                            "integer",
                            "string"
                        ],
                        "description": "Price paid by users or 'NA' if not mentioned."
                    }
                },
                "required": [
                    "rent_price"
                ]
            },
            "expected_result": {
                "rent_price": 3095
            }
        }
    ]

