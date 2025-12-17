from __future__ import annotations
from dataclasses import dataclass
from typing import List, Callable, Optional
from calculators.dls_calculator import DLSCalculator
from .enums import DLSScenarioEnum


@dataclass(frozen=True)
class ScenarioRule:
    required_inputs: List[str]
    validator: Callable


class ScenarioValidator:

    field_map = {
        "overs_available_to_team_1_at_start": "oversAvailableToTeam1AtStart",
        "runs_scored_by_team_1": "runsScoredByTeam1",
        "wickets_lost_by_team_1_during_curtailed": "wicketsLostByTeam1DuringCurtailed",
        "overs_used_by_team_1_during_curtailed": "oversUsedByTeam1DuringCurtailed",
        "overs_used_by_team_1_during_interruption": "oversUsedByTeam1DuringInterruption",
        "wickets_lost_by_team_1_during_interruption": "wicketsLostByTeam1DuringInterruption",
        "revised_overs_to_team_1_after_resumption": "revisedOversToTeam1AfterResumption",
        "overs_available_to_team_2_at_start": "oversAvailableToTeam2AtStart",
        "overs_used_by_team_2_during_curtailed": "oversUsedByTeam2DuringCurtailed",
        "overs_used_by_team_2_during_interruption": "oversUsedByTeam2DuringInterruption",
        "wickets_lost_by_team_2_during_interruption": "wicketsLostByTeam2DuringInterruption",
        "revised_overs_to_team_2_after_resumption": "revisedOversToTeam2AfterResumption",
        "wickets_lost_by_team_2_during_curtailed": "wicketsLostByTeam2DuringCurtailed",
    }

    @classmethod
    def _validate_greater(cls, data, errors, larger_key, smaller_key, strict=True, error_key=None):
        """
        Ensures that data[larger_key] is greater than (or equal to, if strict=False) data[smaller_key].
        
        Args:
            strict (bool): If True, enforces >. If False, enforces >=.
        """
        is_invalid = False
        if strict:
            if data[larger_key] <= data[smaller_key]:
                is_invalid = True
        else:
            if data[larger_key] < data[smaller_key]:
                is_invalid = True
        
        if is_invalid:
            target_key = error_key or smaller_key
            if target_key == smaller_key:
                msg = f"Must be lesser than {cls.field_map[larger_key]}"
                if not strict:
                    msg = f"Must be lesser than or equal to {cls.field_map[larger_key]}"
            else:
                msg = f"Must be greater than {cls.field_map[smaller_key]}"
            errors[target_key] = [msg]

    @classmethod
    def validate_first_innings_curtailed_inputs(cls, data):
        errors = {}

        cls._validate_greater(
            data, errors, 
            "overs_available_to_team_1_at_start", 
            "overs_available_to_team_2_at_start"
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "overs_used_by_team_1_during_curtailed",
            error_key="overs_used_by_team_1_during_curtailed"
        )

        cls._validate_greater(
            data, errors,
            "overs_used_by_team_1_during_curtailed",
            "overs_available_to_team_2_at_start",
            strict=False
        )

        return errors

    @classmethod
    def validate_first_innings_interrupted_inputs(cls, data):
        errors = {}

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "overs_used_by_team_1_during_interruption",
            error_key="overs_available_to_team_1_at_start"
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "overs_available_to_team_2_at_start"
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "revised_overs_to_team_1_after_resumption"
        )

        cls._validate_greater(
            data, errors,
            "revised_overs_to_team_1_after_resumption",
            "overs_available_to_team_2_at_start"
        )

        return errors

    @classmethod
    def validate_second_innings_curtailed_inputs(cls, data):
        errors = {}

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "overs_available_to_team_2_at_start",
            strict=False
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "overs_used_by_team_2_during_curtailed",
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_2_at_start",
            "overs_used_by_team_2_during_curtailed",
        )

        return errors

    @classmethod
    def validate_second_innings_interrupted_inputs(cls, data, errors = {}):

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_1_at_start",
            "overs_available_to_team_2_at_start",
            strict=False
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_2_at_start",
            "overs_used_by_team_2_during_interruption",
        )

        cls._validate_greater(
            data, errors,
            "overs_available_to_team_2_at_start",
            "revised_overs_to_team_2_after_resumption",
        )

        cls._validate_greater(
            data, errors,
            "revised_overs_to_team_2_after_resumption",
            "overs_used_by_team_2_during_interruption",
        )

        return errors


SCENARIO_RULES = {
    DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value: ScenarioRule(
        required_inputs=[
            "overs_available_to_team_1_at_start",
            "runs_scored_by_team_1",
            "wickets_lost_by_team_1_during_curtailed",
            "overs_used_by_team_1_during_curtailed",
            "overs_available_to_team_2_at_start",
        ],
        validator=ScenarioValidator.validate_first_innings_curtailed_inputs,
    ),

    DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value: ScenarioRule(
        required_inputs=[
            "overs_available_to_team_1_at_start",
            "overs_used_by_team_1_during_interruption",
            "wickets_lost_by_team_1_during_interruption",
            "revised_overs_to_team_1_after_resumption",
            "runs_scored_by_team_1",
            "overs_available_to_team_2_at_start",
        ],
        validator=ScenarioValidator.validate_first_innings_interrupted_inputs,
    ),

    DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value: ScenarioRule(
        required_inputs=[
            "overs_available_to_team_1_at_start",
            "runs_scored_by_team_1",
            "overs_available_to_team_2_at_start",
            "overs_used_by_team_2_during_curtailed",
            "wickets_lost_by_team_2_during_curtailed",
        ],
        validator=ScenarioValidator.validate_second_innings_curtailed_inputs,
    ),

    DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value: ScenarioRule(
        required_inputs=[
            "overs_available_to_team_1_at_start",
            "runs_scored_by_team_1",
            "overs_available_to_team_2_at_start",
            "overs_used_by_team_2_during_interruption",
            "wickets_lost_by_team_2_during_interruption",
            "revised_overs_to_team_2_after_resumption",
        ],
        validator=ScenarioValidator.validate_second_innings_interrupted_inputs,
    ),
}
