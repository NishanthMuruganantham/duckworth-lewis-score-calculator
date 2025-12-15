from enum import Enum


class DLSScenarioEnum(Enum):
    FIRST_INNINGS_CURTAILED = "FirstInningsCurtailed"
    FIRST_INNINGS_INTERRUPTED = "FirstInningsInterrupted"
    SECOND_INNINGS_CURTAILED = "SecondInningsCurtailed"
    SECOND_INNINGS_DELAYED = "SecondInningsDelayed"
    SECOND_INNINGS_INTERRUPTED = "SecondInningsInterrupted"

DLS_SCENARIO_CHOICES = [(member.value, member.name) for member in DLSScenarioEnum]


class MatchFormatEnum(Enum):
    ODI = "ODI"
    T10 = "T10"
    T20 = "T20"

DLS_MATCH_FORMAT_CHOICES = [(member.value, member.name) for member in MatchFormatEnum]
