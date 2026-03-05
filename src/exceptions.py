class PartnerAlreadyExistsError(Exception):
    def __init__(self, name: str):
        self.name = name
        super().__init__(f"Partner with name '{name}' already exists")


class InvalidCredentialsError(Exception):
    def __init__(self):
        super().__init__("Invalid credentials")


class TokenExpiredError(Exception):
    def __init__(self):
        super().__init__("Token expired")


class InvalidTokenError(Exception):
    def __init__(self):
        super().__init__("Invalid token")
