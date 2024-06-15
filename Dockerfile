# Gunakan image dasar yang sesuai
FROM python:3.10.2

# Set direktori kerja dalam container
WORKDIR /app

# Salin file requirements.txt ke direktori kerja
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Salin semua file ke direktori kerja
COPY . .

# Ekspose port 8080
EXPOSE 8080

# Perintah untuk menjalankan aplikasi
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
