FROM python:3.9

WORKDIR /backend

# Copy all files first
COPY . /backend

# Copy the requirements file for pip installation
COPY ./requirements.txt requirements.txt

# Create virtual environment and install dependencies
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Set virtual environment in PATH
ENV PATH="/opt/venv/bin:$PATH"
ENTRYPOINT ["./docker-entrypoint.sh"]
# CMD ["daphne", "contract_service.asgi:application"]
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "contract_service.asgi:application"]

# Command to run the FastAPI app
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]