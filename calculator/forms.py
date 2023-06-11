from django import forms
from .validators import decimal_validator


class DLSInputForm(forms.Form):
    
    # Forms Fields
    overs_available_to_team_one = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    runs_scored_by_team_one = forms.IntegerField()
    
    overs_available_to_team_two_at_start = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    
    overs_used_by_team_two_until_interruption = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'})
    )
    
    wickets_lost_by_team_two = forms.IntegerField()
    
    maximum_overs_allotted_to_team_two_after_resumption = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'})
    )
    
    # Additional Validations
    def clean(self):
        
        decimal_validation_message = "Invalid input for overs. Number after decimal should be between 1 and 5"
        
        cleaned_data = super().clean()
        overs_available_to_team_one = cleaned_data.get('overs_available_to_team_one')
        overs_available_to_team_two_at_start = cleaned_data.get('overs_available_to_team_two_at_start')
        overs_used_by_team_two_until_interruption = cleaned_data.get('overs_used_by_team_two_until_interruption')
        
        if not decimal_validator(overs_available_to_team_one):
            self.add_error(
                "overs_available_to_team_two_at_start",
                decimal_validation_message
            )
        if not decimal_validator(overs_available_to_team_two_at_start):
            self.add_error(
                "overs_available_to_team_two_at_start",
                decimal_validation_message
            )
        if not decimal_validator(overs_used_by_team_two_until_interruption):
            self.add_error(
                "overs_used_by_team_two_until_interruption",
                decimal_validation_message
            )
        
        if overs_available_to_team_one and overs_available_to_team_two_at_start:
            if overs_available_to_team_two_at_start > overs_available_to_team_one:
                self.add_error(
                    'overs_available_to_team_two_at_start',
                    'Overs available to Team Two at start should be less than or equal to Overs available to Team One'
                )

        if overs_used_by_team_two_until_interruption and overs_available_to_team_two_at_start:
            if overs_used_by_team_two_until_interruption >= overs_available_to_team_two_at_start:
                self.add_error(
                    'overs_used_by_team_two_until_interruption',
                    'Overs used by Team Two until interruption should be less than the overs available to Team Two at start'
                )



class DLSInputFormWhenFirstInningsIsCompletedAndSecondInningsIsCutshort(forms.Form):
    
    # Forms Fields
    overs_available_to_team_one = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    runs_scored_by_team_one = forms.IntegerField()
    
    overs_available_to_team_two_at_start = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'}),
    )
    
    overs_used_by_team_two_until_cutoff = forms.FloatField(
        min_value=0,
        max_value=20,
        widget=forms.NumberInput(attrs={'step': '0.1'})
    )
    
    wickets_lost_by_team_two = forms.IntegerField()
    
    # Additional Validations
    def clean(self):
        
        decimal_validation_message = "Invalid input for overs. Number after decimal should be between 1 and 5"
        
        cleaned_data = super().clean()
        overs_available_to_team_one = cleaned_data.get('overs_available_to_team_one')
        overs_available_to_team_two_at_start = cleaned_data.get('overs_available_to_team_two_at_start')
        overs_used_by_team_two_until_cutoff = cleaned_data.get('overs_used_by_team_two_until_cutoff')
        
        if not decimal_validator(overs_available_to_team_one):
            self.add_error(
                "overs_available_to_team_two_at_start",
                decimal_validation_message
            )
        if not decimal_validator(overs_available_to_team_two_at_start):
            self.add_error(
                "overs_available_to_team_two_at_start",
                decimal_validation_message
            )
        if not decimal_validator(overs_used_by_team_two_until_cutoff):
            self.add_error(
                "overs_used_by_team_two_until_cutoff",
                decimal_validation_message
            )
        
        if overs_available_to_team_one and overs_available_to_team_two_at_start:
            if overs_available_to_team_two_at_start > overs_available_to_team_one:
                self.add_error(
                    'overs_available_to_team_two_at_start',
                    'Overs available to Team Two at start should be less than or equal to Overs available to Team One'
                )

        if overs_used_by_team_two_until_cutoff and overs_available_to_team_two_at_start:
            if overs_used_by_team_two_until_cutoff >= overs_available_to_team_two_at_start:
                self.add_error(
                    'overs_used_by_team_two_until_cutoff',
                    'Overs used by Team Two until interruption should be less than the overs available to Team Two at start'
                )
