from enum import Enum


class DLSScenarioEnum(Enum):
    FIRST_INNINGS_CURTAILED = "first_innings_curtailed"
    FIRST_INNINGS_INTERRUPTED = "first_innings_interrupted"
    SECOND_INNINGS_CURTAILED = "second_innings_curtailed"
    SECOND_INNINGS_DELAYED = "second_innings_delayed"
    SECOND_INNINGS_INTERRUPTED = "second_innings_interrupted"

DLS_SCENARIO_CHOICES = [(member.value, member.name) for member in DLSScenarioEnum]


class MatchFormatEnum(Enum):
    ODI = "ODI"
    T10 = "T10"
    T20 = "T20"

DLS_MATCH_FORMAT_CHOICES = [(member.value, member.name) for member in MatchFormatEnum]
