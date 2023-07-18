##
import platform
import io, os, sys
import pika
import json
import platform
import json
import ssl
import logging 
  
##
## Configure test vs. production
##
debugKey = f"{platform.node()}.rest.debug"

rabbitMQHost = os.getenv("RABBITMQ_HOST") or "localhost"
print("Connecting to rabbitmq({})".format(rabbitMQHost))

def analyze():
    connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitMQHost))
    channel = connection.channel()

    channel.exchange_declare(exchange='logs', exchange_type='topic')

    def log_debug(message, key=debugKey):
        channel.basic_publish(
            exchange='logs', routing_key=key, body=message)

    log_debug("Hello word")
    connection.close()

    return 

if __name__ == '__main__':
  analyze()