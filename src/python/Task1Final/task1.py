import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
import string
import re
from urllib.parse import quote, unquote
from datetime import datetime
from fastapi import FastAPI,Request, HTTPException
from fastapi.responses import HTMLResponse
import requests
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
app = FastAPI()

# CORS settings
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

async def fetch_html(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.prettify()

# Download NLTK stopwords
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Function for text preprocessing
def preprocess_text(text):
    if pd.isna(text):  # Check for NaN values
        return ""
    text = str(text).lower()  # Convert to lowercase and ensure it's a string
    text = text.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    text = re.sub(r'[^\x00-\x7F]+', '', text)  # Remove non-ASCII characters
    tokens = text.split()  # Tokenize
    tokens = [word for word in tokens if word not in stop_words]  # Remove stopwords
    return ' '.join(tokens)

@app.get("/unique_content/{file1}/{file2}")
async def reat_root(file1: str, file2: str):
    # Load the CSV files
    print("Loading CSV files...")
    # Ensure the file path is correct and exists
    if not os.path.exists(file1):
         raise FileNotFoundError(f"File {file1} not found.")
        # Read the CSV file into a pandas DataFrame
    df1 = pd.read_csv(file1)
    
    if not os.path.exists(file2):
         raise FileNotFoundError(f"File {file2} not found.")
        # Read the CSV file into a pandas DataFrame
    df2 = pd.read_csv(file2)
    print("CSV files loaded successfully.")

    # Print the first few rows to verify the contents
    print("First few rows of df1:")
    print(df1.head())

    print("First few rows of df2:")
    print(df2.head())

    # Preprocess the texts in 'Title' and 'Meta Description' columns
    print("Preprocessing text columns...")
    df1['Processed_Text'] = (df1['Title'].fillna('') + ' ' + df1['Meta Description'].fillna('')).apply(preprocess_text)
    df2['Processed_Text'] = (df2['Title'].fillna('') + ' ' + df2['Meta Description'].fillna('')).apply(preprocess_text)
    print("Text columns preprocessed.")

    # Vectorize the texts using TF-IDF
    print("Vectorizing texts using TF-IDF...")
    vectorizer = TfidfVectorizer()
    X_df1 = vectorizer.fit_transform(df1['Processed_Text'])
    X_df2 = vectorizer.transform(df2['Processed_Text'])
    print("Texts vectorized.")

    # Calculate cosine similarity between the two datasets
    print("Calculating cosine similarity...")
    similarity_matrix = cosine_similarity(X_df1, X_df2)
    print("Cosine similarity calculated.")

    # Find unique blogs in df1 not similar to any blogs in df2 and calculate their uniqueness score
    threshold = 0.5  # Adjust the threshold as needed
    unique_rows = []
    uniqueness_scores = []

    for i in range(similarity_matrix.shape[0]):
        max_similarity = max(similarity_matrix[i])
        if max_similarity < threshold:
            unique_rows.append(df1.iloc[i])
            uniqueness_scores.append(1 - max_similarity)  # Uniqueness score (1 - max similarity)

    # Convert the list of unique rows to a DataFrame
    unique_df = pd.DataFrame(unique_rows)
    unique_df['Uniqueness_Score'] = uniqueness_scores

    # Save the unique rows to a new CSV file
    # output_csv_path = r'unique_content_F.csv'
    # unique_df.to_csv(output_csv_path, index=False)
    # print(f"Unique content saved to '{output_csv_path}'.")

    # Save the unique rows to a new JSON file
    output_json_path = r'unique_content_F.json'
    # unique_df.to_json(output_json_path, orient='records', lines=True)
    json_data = unique_df.to_json()
    # print(f"Unique content saved to '{output_json_path}'.")
    
    return {json_data}

def extract_links(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    # Find all <a> tags within <h3> tags with the specified class
    anchor_tags = soup.find_all('h3', class_='entry-title title post_title')
    
    # Extract href attributes from all <a> tags found
    links = []
    for anchor_tag in anchor_tags:
        link = anchor_tag.find('a').get('href')  # Get the href attribute from the <a> tag
        links.append(link)
    
    # Find the "next page" link
    next_page = soup.find('a', class_='next page-numbers')
    next_page_url = next_page.get('href') if next_page else None
    
    return links, next_page_url

def scrape_all_pages(base_url):
    all_links = []
    url = base_url
    while url:
        links, next_page_url = extract_links(url)
        all_links.extend(links)
        url = next_page_url  # Update the URL to the next page
    
    return all_links

@app.get("/enter_base_url/{base_url:path}")
async def reat_root(base_url: str):
  
    all_links = scrape_all_pages(base_url)

    with open('scraped_links.txt', 'w', encoding='utf-8') as file:
        for link in all_links:
            file.write(link + '\n')

    return {
        "message": "Successfully saved links to 'scraped_links.txt'.",
        "respon":{
            "fileName": "scraped_links.txt",
            "site_link":base_url
            }
    }

@app.get("/generatehtmlfile/{encoded_url:path}")
async def read_root(encoded_url: str):
    decoded_url = unquote(encoded_url)
    r = requests.get(decoded_url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'})
    r.raise_for_status()  # Check for request errors

        # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(r.text, 'html.parser')
    html_content = soup.prettify()
    file_path = "fetched_page.html"
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(html_content)
        
    return {"message": f"Your {decoded_url} page is done! which name is {file_path}"}

# async def add_referrer_policy_header(request: Request, call_next):
#     response = await call_next(request)
#     response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
#     return response

@app.get("/")
async def read_root():
    return "Hellow World"
    
@app.get("/int/{id}")
async def read_root(id: int):
    return {"message": f"Hello, your ID is {id}"}


@app.get("/files/{file1}/{file2}")
async def get_files(file1: str, file2: str):
    return {"file1": file1, "file2": file2}

@app.get("/url/{encoded_url:path}")
async def read_root(encoded_url: str):
    decoded_url = unquote(encoded_url)
    return {"message": f"Hello, your URL is {decoded_url}"}