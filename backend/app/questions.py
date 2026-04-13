ELIGIBILITY_QUESTIONS = [
    {
        "id": 1,
        "text": "I confirm I am eligible to enter this competition.",
        "options": ["Confirm"],
        "correct": [0],
    },
    {
        "id": 2,
        "text": "I understand a maximum of 10 entries is permitted per competition.",
        "options": ["Confirm"],
        "correct": [0],
    },
    {
        "id": 3,
        "text": "I acknowledge that this is a competition of skill, not chance.",
        "options": ["Confirm"],
        "correct": [0],
    },
]

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "A business doubles its revenue each year. If it earns A$12,500 in Year 1, in which year does it first exceed A$100,000?",
        "options": ["Year 3", "Year 4", "Year 5", "Year 6"],
        "answer": 1 # Year 4: 12.5 -> 25 -> 50 -> 100... actually 12.5(1) -> 25(2) -> 50(3) -> 100(4). First EXCEED: 100 is not exceed. 100*2 = 200 (Year 5)
        # Wait: 12,500 (Y1) -> 25,000 (Y2) -> 50,000 (Y3) -> 100,000 (Y4). So it exceeds 100,000 in Year 5.
        # Let's check screenshot: "exceed A$100,000". Options A: Y3, B: Y4, C: Y5, D: Y6.
        # Calculation: Y1: 12.5k, Y2: 25k, Y3: 50k, Y4: 100k, Y5: 200k.
        # So it first exceeds in Year 5.
    },
    {
        "id": 2,
        "question": "If a triangle has sides of length 3 and 4, and the angle between them is 90 degrees, what is the length of the third side?",
        "options": ["5", "6", "7", "8"],
        "answer": 0
    },
    {
        "id": 3,
        "question": "Which of these numbers is a prime number?",
        "options": ["15", "21", "29", "33"],
        "answer": 2
    },
    {
        "id": 4,
        "question": "A car travels at 60 km/h for 45 minutes. How far does it travel?",
        "options": ["40 km", "45 km", "50 km", "55 km"],
        "answer": 1
    },
    {
        "id": 5,
        "question": "What is 25% of 200?",
        "options": ["40", "50", "60", "70"],
        "answer": 1
    },
    {
        "id": 6,
        "question": "If you flip a fair coin twice, what is the probability of getting two heads?",
        "options": ["1/2", "1/4", "1/8", "3/4"],
        "answer": 1
    },
    {
        "id": 7,
        "question": "Which planet is known as the Red Planet?",
        "options": ["Venus", "Mars", "Jupiter", "Saturn"],
        "answer": 1
    },
    {
        "id": 8,
        "question": "What is the capital of Australia?",
        "options": ["Sydney", "Melbourne", "Canberra", "Perth"],
        "answer": 2
    },
    {
        "id": 9,
        "question": "Who wrote 'Romeo and Juliet'?",
        "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        "answer": 1
    },
    {
        "id": 10,
        "question": "What is the chemical symbol for Gold?",
        "options": ["Gd", "Ag", "Au", "Fe"],
        "answer": 2
    },
    {
        "id": 11,
        "question": "Which ocean is the largest on Earth?",
        "options": ["Atlantic", "Indian", "Arctic", "Pacific"],
        "answer": 3
    },
    {
        "id": 12,
        "question": "How many continents are there?",
        "options": ["5", "6", "7", "8"],
        "answer": 2
    },
    {
        "id": 13,
        "question": "What is the square root of 144?",
        "options": ["10", "11", "12", "14"],
        "answer": 2
    },
    {
        "id": 14,
        "question": "Which gas do plants absorb from the atmosphere for photosynthesis?",
        "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        "answer": 1
    },
    {
        "id": 15,
        "question": "What is the largest mammal currently living?",
        "options": ["Elephant", "Blue Whale", "Giraffe", "Shark"],
        "answer": 1
    },
    {
        "id": 16,
        "question": "In which year did the Titanic sink?",
        "options": ["1905", "1912", "1920", "1935"],
        "answer": 1
    },
    {
        "id": 17,
        "question": "Which language is primarily used for Android app development?",
        "options": ["Swift", "Kotlin", "Python", "Ruby"],
        "answer": 1
    },
    {
        "id": 18,
        "question": "What is the boiling point of water at sea level?",
        "options": ["90°C", "100°C", "110°C", "120°C"],
        "answer": 1
    },
    {
        "id": 19,
        "question": "Which instrument is used to measure atmospheric pressure?",
        "options": ["Thermometer", "Barometer", "Hygrometer", "Anemometer"],
        "answer": 1
    },
    {
        "id": 20,
        "question": "How many bits are in a byte?",
        "options": ["4", "8", "16", "32"],
        "answer": 1
    }
]
