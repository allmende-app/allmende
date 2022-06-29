FROM python:3.9
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /var/src/allmende-ml
WORKDIR /var/src/allmende-ml

COPY . .
RUN python3 -m venv /var/src/allmende-ml/venv
ENV PATH="/var/src/allmende-ml/venv:$PATH"
RUN pip install -Ur requirements.txt

EXPOSE 5000
CMD ["flask", "run"]


