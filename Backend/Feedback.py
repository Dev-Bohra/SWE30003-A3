import os
from urllib.parse import urlparse

class Feedback:
    SUPPORTED_FILE_TYPE = {".jpg", ".jpeg", ".png", ".mp4"}

    def __init__(self, rating, description, media):
        self._rating = None
        self._description = None
        self._media = None

        self.rating = rating
        self.description = description
        self.media = media

    @property
    def rating(self):
        return self._rating

    @rating.setter
    def rating(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError("rating must be a number.")
        if not (0 <= value <= 5):
            raise ValueError("rating must be between 0 and 5.")
        self._rating = float(value)

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, value):
        if not isinstance(value, str):
            raise TypeError("Description must be a string.")
        self._description = value.strip()

    @property
    def media(self):
        return self._media

    @media.setter
    def media(self, value):
        self._media = self.validate_media(value)

    def validate_media(self, media):
        if not isinstance(media, list):
            raise TypeError("Media must be a list of URLs.")
        if len(media) > 4:
            raise ValueError("Only 4 media files are allowed.")

        for link in media:
            ext = self.get_extension(link)
            if ext not in self.SUPPORTED_FILE_TYPE:
                raise ValueError(f"Unsupported file extension: {ext}")
        return media

    def get_extension(self, url):
        path = urlparse(url).path
        _, ext = os.path.splitext(path)
        return ext.lower()
