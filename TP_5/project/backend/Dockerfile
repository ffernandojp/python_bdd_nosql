# Create our image based on Python 3.8
FROM python:3.8

# Expose ports
EXPOSE 5000

# Tell Python to not generate .pyc
ENV PYTHONDONTWRITEBYTECODE 1

# Turn off buffering
ENV PYTHONUNBUFFERED 1


# Set environment variables for MongoDB connection
ENV MONGODB_HOST mongodb
ENV MONGODB_USERNAME apiuser 
ENV MONGODB_PASSWORD apipassword


# Install requirements using pip
ADD requirements.txt .
RUN python -m pip install -r requirements.txt

# Set working directory and addour Flask API files
WORKDIR /app
ADD . /app

# Copy the scripts folder
COPY bd_scripts/characters_pictures/images/ /app/bd_scripts/characters_pictures/images
