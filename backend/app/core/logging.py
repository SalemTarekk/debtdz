import logging
from logging.handlers import QueueHandler, QueueListener
from queue import Queue

from app.core.config import settings


def setup_logging():
    level = getattr(logging, settings.log_level.upper(), logging.DEBUG)
    logger = logging.getLogger()
    logger.setLevel(level)

    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    ))

    queue = Queue()
    queue_handler = QueueHandler(queue)
    queue_handler.setLevel(level)
    logger.addHandler(queue_handler)

    listener = QueueListener(queue, handler)
    listener.start()

    return listener
