from rest_framework import serializers
from .validators import SCENARIO_RULES


class DLSRequestSerializer(serializers.Serializer):

    dls_scenario = serializers.CharField()

    overs_available_to_team_1_at_resumption = serializers.FloatField(required=False)
    overs_available_to_team_1_at_start = serializers.FloatField(required=False)
    overs_used_by_team_1_during_curtailed = serializers.FloatField(required=False)
    runs_scored_by_team_1 = serializers.IntegerField(required=False)
    wickets_lost_by_team_1 = serializers.IntegerField(required=False)
    wickets_lost_by_team_1_during_curtailed = serializers.IntegerField(required=False)

    overs_available_to_team_2_at_start = serializers.FloatField(required=False)
    overs_available_to_team_2_after_interruption = serializers.FloatField(required=False)

    def validate(self, data):
        scenario = data.get("dls_scenario")
        rule = SCENARIO_RULES.get(scenario)

        if not rule:
            return data

        # Validating missing fields
        missing = [f for f in rule["required"] if data.get(f) is None]
        if missing:
            raise serializers.ValidationError({
                field: [f"This field is required for {scenario} scenario."]
                for field in missing
            })

        # Validating scenario-specific rules
        validator = rule.get("validator")
        if validator:
            errors = validator(data)
            if errors:
                raise serializers.ValidationError(errors)

        return data
