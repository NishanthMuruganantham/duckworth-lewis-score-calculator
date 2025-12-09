from enum import Enum


class DLSScenarioEnum(Enum):
    FIRST_INNINGS_CURTAILED = "FirstInningsCurtailed"
    FIRST_INNINGS_INTERRUPTED = "FirstInningsInterrupted"
    SECOND_INNINGS_CURTAILED = "SecondInningsCurtailed"
    SECOND_INNINGS_DELAYED = "SecondInningsDelayed"
    SECOND_INNINGS_INTERRUPTED = "SecondInningsInterrupted"

DLS_SCENARIO_CHOICES = [(member.value, member.name) for member in DLSScenarioEnum]
