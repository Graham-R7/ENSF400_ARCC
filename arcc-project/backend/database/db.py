import mysql.connector
from mysql.connector import pooling
from config import Config

_pool = pooling.MySQLConnectionPool(
    pool_name="arcc_pool",
    pool_size=5,
    host=Config.DB_HOST,
    port=Config.DB_PORT,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    database=Config.DB_NAME,
)

def get_conn():
    return _pool.get_connection()