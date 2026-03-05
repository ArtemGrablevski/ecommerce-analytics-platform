from typing import TypedDict


class JwtTokenPayload(TypedDict):
    sub: str
    name: str
    exp: int
