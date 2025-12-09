from .enums import DLSScenarioEnum


class ScenarioValidator:

    field_map = {
        "overs_available_to_team_1_at_start": "oversAvailableToTeam1AtStart",
        "runs_scored_by_team_1": "runsScoredByTeam1",
        "wickets_lost_by_team_1": "wicketsLostByTeam1",
        "overs_used_by_team_1_during_curtailed": "oversUsedByTeam1DuringCurtailed",
        "overs_available_to_team_2_at_start": "oversAvailableToTeam2AtStart",
        "overs_available_to_team_2_after_interruption": "oversAvailableToTeam2AfterInterruption",
    }

    @classmethod
    def validate_first_innings_curtailed(cls, data):
        errors = {}

        if data["overs_available_to_team_1_at_start"] <= data["overs_available_to_team_2_at_start"]:
            errors["overs_available_to_team_1_at_start"] = [
                f"Must be greater than {cls.field_map['overs_available_to_team_2_at_start']}"
            ]

        if data["overs_available_to_team_1_at_start"] <= data["overs_used_by_team_1_during_curtailed"]:
            errors["overs_available_to_team_1_at_start"] = [
                f"Must be greater than {cls.field_map['overs_used_by_team_1_during_curtailed']}"
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
    DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value: {
        "required": [
            "overs_available_to_team_1_at_start",
            "runs_scored_by_team_1",
            "wickets_lost_by_team_1",
            "overs_used_by_team_1_during_curtailed",
            "overs_available_to_team_2_at_start",
        ],
        "validator": ScenarioValidator.validate_first_innings_curtailed,
    },

    DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value: {
        "required": [
            "overs_available_to_team_1_at_start",
            "runs_scored_by_team_1",
            "wickets_lost_by_team_1",
            "overs_used_by_team_1_during_curtailed",
        ],
        "validator": ScenarioValidator.validate_first_innings_interrupted,
    },
}
