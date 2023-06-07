from django.shortcuts import render
from django.http import JsonResponse
from .forms import DLSInputForm
from .utils.scripts import get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted


def cricket_match_details(request):
    if request.method == 'POST':
        dls_input_form = DLSInputForm(request.POST)
        if dls_input_form.is_valid():
            overs_available_to_team_one = dls_input_form.cleaned_data['overs_available_to_team_one']
            runs_scored_by_team_one = dls_input_form.cleaned_data['runs_scored_by_team_one']
            overs_available_to_team_two_at_start = dls_input_form.cleaned_data['overs_available_to_team_two_at_start']
            overs_used_by_team_two_until_interruption = dls_input_form.cleaned_data['overs_used_by_team_two_until_interruption']
            wickets_lost_by_team_two = dls_input_form.cleaned_data['wickets_lost_by_team_two']
            maximum_overs_allotted_to_team_two_after_resumption = dls_input_form.cleaned_data['maximum_overs_allotted_to_team_two_after_resumption']
            
            result = get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted(
                runs_scored_by_team_one=runs_scored_by_team_one,
                overs_available_to_team_one=overs_available_to_team_one,
                overs_available_to_team_two_at_start=overs_available_to_team_two_at_start,
                overs_used_by_team_two_until_interruption=overs_used_by_team_two_until_interruption,
                wickets_lost_by_team_two=wickets_lost_by_team_two,
                maximum_overs_allotted_to_team_two_after_resumption=maximum_overs_allotted_to_team_two_after_resumption
            )
            
            return JsonResponse({'result': round(result)})
        
        errors = dls_input_form.errors.as_json()
        return JsonResponse({'errors': errors}, status=400)
        
    else:
        dls_input_form = DLSInputForm()
        return render(request, 'cricket_form.html', {'form': dls_input_form})
