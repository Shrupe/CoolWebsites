from dotenv import load_dotenv
import os

load_dotenv()

PASSWORD=os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")
DB=os.getenv("DB")
USER=os.getenv("USER")
                                       
PASSWORD="986532"
HOST="localhost"
PORT="5432"
DB="coolweb"
USER="postgres"


URL = f"postgresql+asyncpg://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}"
DATABASE_URL = os.getenv("DATABASE_URL", URL)