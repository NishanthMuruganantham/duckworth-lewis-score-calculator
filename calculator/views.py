from django.shortcuts import render
from django.http import JsonResponse
from .utils.scripts import get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted


def cricket_match_details(request):
    if request.method == 'POST':
        overs_available_to_team_one = float(request.POST.get('overs_available_to_team_one'))
        runs_scored_by_team_one = int(request.POST.get('runs_scored_by_team_one'))
        overs_available_to_team_two_at_start = float(request.POST.get('overs_available_to_team_two_at_start'))
        overs_used_by_team_two_until_interruption = float(request.POST.get('overs_used_by_team_two_until_interruption'))
        wickets_lost_by_team_two = int(request.POST.get('wickets_lost_by_team_two'))
        maximum_overs_allotted_to_team_two_after_resumption = float(request.POST.get('maximum_overs_allotted_to_team_two_after_resumption'))
        
        result = get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted(
            runs_scored_by_team_one=runs_scored_by_team_one,
            overs_available_to_team_one=overs_available_to_team_one,
            overs_available_to_team_two_at_start=overs_available_to_team_two_at_start,
            overs_used_by_team_two_until_interruption=overs_used_by_team_two_until_interruption,
            wickets_lost_by_team_two=wickets_lost_by_team_two,
            maximum_overs_allotted_to_team_two_after_resumption=maximum_overs_allotted_to_team_two_after_resumption
        )
        
        return JsonResponse({'result': round(result)})
    else:
        return render(request, 'cricket_form.html')
