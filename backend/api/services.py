from .enums import DLSScenarioEnum
from calculators.dls_calculator import DLSCalculator
from rest_framework.exceptions import ValidationError
from typing import Dict, Callable, Union


class DLSService:

    def __init__(self):
        self.scenario_map_getters: Dict[str, str] = {
            DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value: "calculate_par_score_first_innings_cut_short",
            DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value: "calculate_par_score_first_innings_interrupted",
            DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value: "calculate_par_score_second_innings_cut_short",
            DLSScenarioEnum.SECOND_INNINGS_DELAYED.value: "calculate_par_score_second_innings_delayed",
            DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value: "calculate_par_score_second_innings_interrupted",
        }

    def calculate(self, validated_data: Dict[str, Union[str, Dict[str, Union[int, float]]]]) -> int:
        scenario = validated_data["scenario_type"]
        match_format = validated_data["match_format"]
        inputs: Dict[str, Union[int, float]] = validated_data["inputs"]

        calculator = DLSCalculator(match_format)
        calculator_method_name = self.scenario_map_getters[scenario]
        calculator_method: Callable = getattr(calculator, calculator_method_name)

        return round(calculator_method(**inputs))
