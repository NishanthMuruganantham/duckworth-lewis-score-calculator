from django.shortcuts import render
from django.http import JsonResponse
from .forms import DLSInputForm, DLSInputFormWhenFirstInningsIsCompletedAndSecondInningsIsCutshort
from .utils.scripts import (
    get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted,
    get_par_score_when_first_innings_is_completed_and_second_innings_is_cut_short
)


def cricket_match_details(request):
    if request.method == 'POST':
        if "second_innings_cut_short" in request.POST:
            return view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_cut_short(request)
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
        dls_second_innings_cutshort_form = DLSInputFormWhenFirstInningsIsCompletedAndSecondInningsIsCutshort()
        return render(
            request, 'cricket_form.html', {
                'form': dls_input_form,
                "dls_second_innings_cutshort_form": dls_second_innings_cutshort_form
            }
        )


def view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_cut_short(request):
    dls_input_form = DLSInputFormWhenFirstInningsIsCompletedAndSecondInningsIsCutshort(request.POST)
    if dls_input_form.is_valid():
        overs_available_to_team_one = dls_input_form.cleaned_data['overs_available_to_team_one_when_second_innings_cut_short']
        runs_scored_by_team_one = dls_input_form.cleaned_data['runs_scored_by_team_one_when_second_innings_cut_short']
        overs_available_to_team_two_at_start = dls_input_form.cleaned_data['overs_available_to_team_two_at_start_when_second_innings_cut_short']
        overs_used_by_team_two_until_cutshort = dls_input_form.cleaned_data['overs_used_by_team_two_until_cutoff_when_second_innings_cut_short']
        wickets_lost_by_team_two = dls_input_form.cleaned_data['wickets_lost_by_team_two_when_second_innings_cut_short']
        print(f"overs_available_to_team_one = {overs_available_to_team_one}")
        result = get_par_score_when_first_innings_is_completed_and_second_innings_is_cut_short(
            overs_available_to_team_one=overs_available_to_team_one,
            runs_scored_by_team_one=runs_scored_by_team_one,
            overs_available_to_team_two_at_start=overs_available_to_team_two_at_start,
            overs_used_by_team_two_until_cutoff=overs_used_by_team_two_until_cutshort,
            wickets_lost_by_team_two=wickets_lost_by_team_two
        )
        
        return JsonResponse({'result': round(result)})
    
    errors = dls_input_form.errors.as_json()
    return JsonResponse({'errors': errors}, status=400)
