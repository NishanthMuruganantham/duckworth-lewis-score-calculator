from django import forms
from .validators import decimal_validator


class DLSInputFormWhenSecondInningsIsInterrupted(forms.Form):
    
    # Forms Fields
    overs_available_to_team_one_when_second_innings_interrupted = forms.FloatField(
        label="Overs available to Team One",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    runs_scored_by_team_one_when_second_innings_interrupted = forms.IntegerField(
        label="Runs scored by Team One"
    )
    overs_available_to_team_two_at_start_when_second_innings_interrupted = forms.FloatField(
        label="Overs available to Team Two at Start of the innings",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    overs_used_by_team_two_until_interruption_when_second_innings_interrupted = forms.FloatField(
        label="Overs used by Team Two until interruption",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'})
    )
    wickets_lost_by_team_two_when_second_innings_interrupted = forms.IntegerField(
        label="Wickets lost by Team Two", min_value=0, max_value=9
    )
    maximum_overs_allotted_to_team_two_after_resumption_when_second_innings_interrupted = forms.FloatField(
        label="Maximum overs allotted to Team Two after resumption",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'})
    )
    
    # Additional Validations
    def clean(self):
        
        decimal_validation_message = "Invalid input for overs. Number after decimal should be between 1 and 5"
        
        cleaned_data = super().clean()
        overs_available_to_team_one = cleaned_data[
            "overs_available_to_team_one_when_second_innings_interrupted"
        ]
        overs_available_to_team_two_at_start = cleaned_data[
            "overs_available_to_team_two_at_start_when_second_innings_interrupted"
        ]
        overs_used_by_team_two_until_interruption = cleaned_data[
            "overs_used_by_team_two_until_interruption_when_second_innings_interrupted"
        ]
        maximum_overs_allotted_to_team_two_after_resumption = cleaned_data[
            "maximum_overs_allotted_to_team_two_after_resumption_when_second_innings_interrupted"
        ]
        
        if not decimal_validator(overs_available_to_team_one):
            self.add_error(
                "overs_available_to_team_one_when_second_innings_interrupted",
                decimal_validation_message
            )
        if not decimal_validator(overs_available_to_team_two_at_start):
            self.add_error(
                "overs_available_to_team_two_at_start_when_second_innings_interrupted",
                decimal_validation_message
            )
        if not decimal_validator(overs_used_by_team_two_until_interruption):
            self.add_error(
                "overs_used_by_team_two_until_interruption_when_second_innings_interrupted",
                decimal_validation_message
            )
        if not decimal_validator(maximum_overs_allotted_to_team_two_after_resumption):
            self.add_error(
                "maximum_overs_allotted_to_team_two_after_resumption_when_second_innings_interrupted",
                decimal_validation_message
            )
        
        if overs_available_to_team_one and overs_available_to_team_two_at_start:
            if overs_available_to_team_two_at_start > overs_available_to_team_one:
                self.add_error(
                    'overs_available_to_team_two_at_start_when_second_innings_interrupted',
                    'Overs available to Team Two at start should be less than or equal to Overs available \
                        to Team One'
                )
        if overs_used_by_team_two_until_interruption and overs_available_to_team_two_at_start:
            if overs_used_by_team_two_until_interruption >= overs_available_to_team_two_at_start:
                self.add_error(
                    'overs_used_by_team_two_until_interruption_when_second_innings_interrupted',
                    'Overs used by Team Two until interruption should be less than the overs available to \
                        Team Two at start'
                )
        if maximum_overs_allotted_to_team_two_after_resumption and overs_used_by_team_two_until_interruption:
            if maximum_overs_allotted_to_team_two_after_resumption < overs_used_by_team_two_until_interruption:
                self.add_error(
                    'maximum_overs_allotted_to_team_two_after_resumption_when_second_innings_interrupted',
                    'Maximum overs allotted to team two after resumption should be less than the overs \
                        available to Team Two at start'
                )




class DLSInputFormSecondInningsIsCutshort(forms.Form):
    
    # Forms Fields
    overs_available_to_team_one_when_second_innings_cut_short = forms.FloatField(
        label="Overs available to team one",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    runs_scored_by_team_one_when_second_innings_cut_short = forms.IntegerField(
        label="Runs scored by team one"
    )
    
    overs_available_to_team_two_at_start_when_second_innings_cut_short = forms.FloatField(
        label="Overs available to team two at start",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    
    overs_used_by_team_two_until_cutoff_when_second_innings_cut_short = forms.FloatField(
        label="Overs used by team two during cut short",
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'})
    )
    
    wickets_lost_by_team_two_when_second_innings_cut_short = forms.IntegerField(
        label="Wickets lost by team two"
    )
    
    # Additional Validations
    def clean(self):
        
        decimal_validation_message = "Invalid input for overs. Number after decimal should be between 1 and 5"
        
        cleaned_data = super().clean()
        overs_available_to_team_one_when_second_innings_cut_short = cleaned_data.get('overs_available_to_team_one_when_second_innings_cut_short')
        overs_available_to_team_two_at_start_when_second_innings_cut_short = cleaned_data.get('overs_available_to_team_two_at_start_when_second_innings_cut_short')
        overs_used_by_team_two_until_cutoff_when_second_innings_cut_short = cleaned_data.get('overs_used_by_team_two_until_cutoff_when_second_innings_cut_short')
        
        if not decimal_validator(overs_available_to_team_one_when_second_innings_cut_short):
            self.add_error(
                "overs_available_to_team_one_when_second_innings_cut_short",
                decimal_validation_message
            )
        if not decimal_validator(overs_available_to_team_two_at_start_when_second_innings_cut_short):
            self.add_error(
                "overs_available_to_team_two_at_start_when_second_innings_cut_short",
                decimal_validation_message
            )
        if not decimal_validator(overs_used_by_team_two_until_cutoff_when_second_innings_cut_short):
            self.add_error(
                "overs_used_by_team_two_until_cutoff_when_second_innings_cut_short",
                decimal_validation_message
            )
        
        if overs_available_to_team_one_when_second_innings_cut_short and overs_available_to_team_two_at_start_when_second_innings_cut_short:
            if overs_available_to_team_two_at_start_when_second_innings_cut_short > overs_available_to_team_one_when_second_innings_cut_short:
                self.add_error(
                    'overs_available_to_team_two_at_start_when_second_innings_cut_short',
                    'Overs available to Team Two at start should be less than or equal to Overs available to Team One'
                )

        if overs_used_by_team_two_until_cutoff_when_second_innings_cut_short and overs_available_to_team_two_at_start_when_second_innings_cut_short:
            if overs_used_by_team_two_until_cutoff_when_second_innings_cut_short >= overs_available_to_team_two_at_start_when_second_innings_cut_short:
                self.add_error(
                    'overs_used_by_team_two_until_cutoff_when_second_innings_cut_short',
                    'Overs used by Team Two until interruption should be less than the overs available to Team Two at start'
                )
