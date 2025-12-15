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
        "overs_available_to_team_1_at_resumption": "oversAvailableToTeam1AtResumption",
        "overs_available_to_team_2_at_start": "oversAvailableToTeam2AtStart",
    }

    @classmethod
    def validate_first_innings_curtailed(cls, data):
        errors = {}

        if data["overs_available_to_team_1_at_start"] <= data["overs_available_to_team_2_at_start"]:
            errors["overs_available_to_team_2_at_start"] = [
                f"Must be less than {cls.field_map['overs_available_to_team_1_at_start']}"
            ]

        if data["overs_available_to_team_1_at_start"] <= data["overs_used_by_team_1_during_curtailed"]:
            errors["overs_used_by_team_1_during_curtailed"] = [
                f"Must be lesser than {cls.field_map['overs_available_to_team_1_at_start']}"
            ]

        if data["overs_used_by_team_1_during_curtailed"] < data["overs_available_to_team_2_at_start"]:
            errors["overs_available_to_team_2_at_start"] = [
                f"Must be lesser than {cls.field_map['overs_used_by_team_1_during_curtailed']}"
            ]

        return errors

    @classmethod
    def validate_first_innings_interrupted(cls, data):
        errors = {}

        if data["overs_available_to_team_1_at_start"] <= data["overs_used_by_team_1_during_curtailed"]:
            errors["overs_available_to_team_1_at_start"] = [
                f"Must be greater than {cls.field_map['overs_used_by_team_1_during_curtailed']}"
            ]

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
        validator=ScenarioValidator.validate_first_innings_curtailed,
    ),

    DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value: ScenarioRule(
        required_inputs=[
            "overs_available_to_team_1_at_start",
            "runs_scored_by_team_1",
            "wickets_lost_by_team_1_during_curtailed",
            "overs_available_to_team_1_at_resumption",
            "overs_used_by_team_1_during_curtailed",
        ],
        validator=ScenarioValidator.validate_first_innings_interrupted,
    ),
}
