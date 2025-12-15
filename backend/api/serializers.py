from typing import Dict
from rest_framework import serializers
from .enums import DLS_SCENARIO_CHOICES
from .validators import SCENARIO_RULES


class DLSRequestSerializer(serializers.Serializer):

    """
    Serializer for DLS request body data.
    """

    scenario_type = serializers.ChoiceField(choices=DLS_SCENARIO_CHOICES)
    match_format = serializers.ChoiceField(choices=["ODI", "T20", "T10"])
    inputs = serializers.DictField()

    def validate(self, data):
        scenario = data.get("scenario_type")
        inputs_data: Dict[str, str] = data.get("inputs", {})
        rule = SCENARIO_RULES[scenario]

        # Validating missing fields in inputs for the requested scenario
        missing = [input_field for input_field in rule.required_inputs if inputs_data.get(input_field) is None]
        if missing:
            raise serializers.ValidationError({
                "inputs": {field: ["This field is required."] for field in missing}
            })

        # converting strings from JSON body to numbers
        valid_inputs = {}
        for key, value in inputs_data.items():
            try:
                if "wickets" in key or "runs" in key:
                    valid_inputs[key] = int(float(value))
                else:
                    valid_inputs[key] = float(value)
            except (ValueError, TypeError):
                raise serializers.ValidationError({
                    "inputs": {key: ["Must be a number."]}
                })

        # Updating inputs_data with converted values for the validator to use
        inputs_data.update(valid_inputs)
        data['inputs'] = inputs_data

        # Additional validations based on the scenario
        errors = rule.validator(inputs_data)
        if errors:
            raise serializers.ValidationError({"inputs": errors})

        return data
