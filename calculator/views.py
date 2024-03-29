from django.shortcuts import render
from django.http import JsonResponse
from .forms import (
    DLSInputFormSecondInningsIsCutshort,
    DLSInputFormWhenSecondInningsIsInterrupted,
    DLSInputFormWhenSecondInningsIsDelayed,
    DLSInputFormWhenFirstInningsIsCutshort,
    DLSInputFormWhenFirstInningsIsInterrupted
)
from .scripts import (
    get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted,
    get_par_score_when_first_innings_is_completed_and_second_innings_is_cut_short,
    get_par_score_when_first_innings_is_completed_and_second_innings_is_delayed,
    get_par_score_when_first_innings_is_cut_short,
    get_par_score_when_first_innings_is_interrupted
)


def index(request):
    if request.method == 'POST':
        if request.POST['form_type'] == "second_innings_cut_short":
            return view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_cut_short(request)
        if request.POST['form_type'] == "second_innings_interrupted":
            return view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_interrupted(request)
        if request.POST['form_type'] == "second_innings_delayed":
            return view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_delayed(request)
        if request.POST['form_type'] == "first_innings_cut_short":
            return view_for_dls_input_when_first_innings_is_cut_short(request)
        if request.POST["form_type"] == "first_innings_interrupted":
            return view_for_dls_input_when_first_innings_is_interrupted(request)
    
    else:
        dls_second_innings_interrupted_form = DLSInputFormWhenSecondInningsIsInterrupted()
        dls_second_innings_cutshort_form = DLSInputFormSecondInningsIsCutshort()
        dls_second_innings_delayed_form = DLSInputFormWhenSecondInningsIsDelayed()
        dls_first_innings_cutshort_form = DLSInputFormWhenFirstInningsIsCutshort()
        dls_first_innings_interrupted_form = DLSInputFormWhenFirstInningsIsInterrupted()
        return render(
            request, 'index.html', {
                "dls_second_innings_interrupted_form": dls_second_innings_interrupted_form,
                "dls_second_innings_cutshort_form": dls_second_innings_cutshort_form,
                "dls_second_innings_delayed_form": dls_second_innings_delayed_form,
                "dls_first_innings_cutshort_form": dls_first_innings_cutshort_form,
                "dls_first_innings_interrupted_form": dls_first_innings_interrupted_form
            }
        )


def view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_interrupted(request):
    form = DLSInputFormWhenSecondInningsIsInterrupted(request.POST)
    if form.is_valid():
        overs_available_to_team_one = form.cleaned_data['overs_available_to_team_one_when_second_innings_interrupted']
        runs_scored_by_team_one = form.cleaned_data['runs_scored_by_team_one_when_second_innings_interrupted']
        overs_available_to_team_two_at_start = form.cleaned_data['overs_available_to_team_two_at_start_when_second_innings_interrupted']
        overs_used_by_team_two_until_interruption = form.cleaned_data['overs_used_by_team_two_until_interruption_when_second_innings_interrupted']
        wickets_lost_by_team_two = form.cleaned_data['wickets_lost_by_team_two_when_second_innings_interrupted']
        maximum_overs_allotted_to_team_two_after_resumption = form.cleaned_data['maximum_overs_allotted_to_team_two_after_resumption_when_second_innings_interrupted']
        
        result = get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted(
            runs_scored_by_team_one=runs_scored_by_team_one,
            overs_available_to_team_one=overs_available_to_team_one,
            overs_available_to_team_two_at_start=overs_available_to_team_two_at_start,
            overs_used_by_team_two_until_interruption=overs_used_by_team_two_until_interruption,
            wickets_lost_by_team_two=wickets_lost_by_team_two,
            maximum_overs_allotted_to_team_two_after_resumption=maximum_overs_allotted_to_team_two_after_resumption
        )
        
        return JsonResponse({'result': round(result)})
    
    errors = form.errors.as_json()
    return JsonResponse({'errors': errors}, status=400)


def view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_cut_short(request):
    dls_input_form = DLSInputFormSecondInningsIsCutshort(request.POST)
    if dls_input_form.is_valid():
        overs_available_to_team_one = dls_input_form.cleaned_data['overs_available_to_team_one_when_second_innings_cut_short']
        runs_scored_by_team_one = dls_input_form.cleaned_data['runs_scored_by_team_one_when_second_innings_cut_short']
        overs_available_to_team_two_at_start = dls_input_form.cleaned_data['overs_available_to_team_two_at_start_when_second_innings_cut_short']
        overs_used_by_team_two_until_cutshort = dls_input_form.cleaned_data['overs_used_by_team_two_until_cutoff_when_second_innings_cut_short']
        wickets_lost_by_team_two = dls_input_form.cleaned_data['wickets_lost_by_team_two_when_second_innings_cut_short']
        
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


def view_for_dls_input_when_first_innings_is_completed_and_second_innings_is_delayed(request):
    dls_input_form = DLSInputFormWhenSecondInningsIsDelayed(request.POST)
    if dls_input_form.is_valid():
        overs_available_to_team_one = dls_input_form.cleaned_data[
            "overs_available_to_team_one_when_second_innings_delayed"
        ]
        runs_scored_by_team_one = dls_input_form.cleaned_data[
            "runs_scored_by_team_one_when_second_innings_delayed"
        ]
        overs_available_to_team_two_at_start = dls_input_form.cleaned_data[
            "overs_available_to_team_two_at_start_when_second_innings_delayed"
        ]
        
        result = get_par_score_when_first_innings_is_completed_and_second_innings_is_delayed(
            overs_available_to_team_one=overs_available_to_team_one,
            runs_scored_by_team_one=runs_scored_by_team_one,
            overs_available_to_team_two_at_start=overs_available_to_team_two_at_start
        )
        
        return JsonResponse({'result': round(result)})
    
    errors = dls_input_form.errors.as_json()
    return JsonResponse({'errors': errors}, status=400)


def view_for_dls_input_when_first_innings_is_cut_short(request):
    dls_input_form = DLSInputFormWhenFirstInningsIsCutshort(request.POST)
    if dls_input_form.is_valid():
        overs_available_to_team_one = dls_input_form.cleaned_data['overs_available_to_team_one_when_first_innings_cut_short']
        runs_scored_by_team_one = dls_input_form.cleaned_data['runs_scored_by_team_one_when_first_innings_cut_short']
        wickets_lost_by_team_one = dls_input_form.cleaned_data['wickets_lost_by_team_one_when_first_innings_cut_short']
        overs_used_by_team_one_until_cutshort = dls_input_form.cleaned_data['overs_used_by_team_one_until_cutoff_when_first_innings_cut_short']
        overs_available_to_team_two_at_start = dls_input_form.cleaned_data['overs_available_to_team_two_at_start_when_first_innings_cut_short']
        
        result = get_par_score_when_first_innings_is_cut_short(
            overs_available_to_team_one_at_start=overs_available_to_team_one,
            runs_scored_by_team_one=runs_scored_by_team_one,
            wickets_lost_by_team_one=wickets_lost_by_team_one,
            overs_used_by_team_one_until_interruption=overs_used_by_team_one_until_cutshort,
            overs_available_to_team_two=overs_available_to_team_two_at_start
        )
        
        return JsonResponse({'result': round(result)})
    
    errors = dls_input_form.errors.as_json()
    return JsonResponse({'errors': errors}, status=400)


def view_for_dls_input_when_first_innings_is_interrupted(request):
    dls_input_form = DLSInputFormWhenFirstInningsIsInterrupted(request.POST)
    if dls_input_form.is_valid():
        overs_available_to_team_one = dls_input_form.cleaned_data['overs_available_to_team_one_when_first_innings_interrupted']
        overs_used_by_team_one_until_interruption = dls_input_form.cleaned_data['overs_used_by_team_one_until_interruption_when_first_innings_interrupted']
        wickets_lost_by_team_one = dls_input_form.cleaned_data['wickets_lost_by_team_one_until_interruption_when_first_innings_interrupted']
        runs_scored_by_team_one = dls_input_form.cleaned_data['runs_scored_by_team_one_when_first_innings_interrupted']
        maximum_overs_allotted_to_team_one_after_resumption = dls_input_form.cleaned_data['maximum_overs_allotted_to_team_one_after_resumption_when_first_innings_interrupted']
        overs_available_to_team_two_at_start = dls_input_form.cleaned_data['overs_available_to_team_two_at_start_when_first_innings_interrupted']
        
        result = get_par_score_when_first_innings_is_interrupted(
            overs_available_to_team_one_at_start=overs_available_to_team_one,
            wickets_lost_by_team_one_during_interruption=wickets_lost_by_team_one,
            overs_used_by_team_one_until_interruption=overs_used_by_team_one_until_interruption,
            maximum_overs_allotted_to_team_one_after_resumption=maximum_overs_allotted_to_team_one_after_resumption,
            total_runs_scored_by_team_one_at_the_end_of_their_innings=runs_scored_by_team_one,
            overs_available_to_team_two_at_start=overs_available_to_team_two_at_start
        )
        
        return JsonResponse({'result': round(result)})
    
    errors = dls_input_form.errors.as_json()
    return JsonResponse({'errors': errors}, status=400)
