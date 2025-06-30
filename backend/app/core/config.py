from dotenv import load_dotenv
import os

load_dotenv()

PASSWORD=os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")
DB=os.getenv("DB")
USER=os.getenv("USER")
                                      
URL = f"postgresql+asyncpg://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}"
DATABASE_URL = os.getenv("DATABASE_URL", URL)
