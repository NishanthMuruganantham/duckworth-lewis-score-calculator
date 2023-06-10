import pandas as pd
import numpy as np


resource_table_df = pd.read_csv(f"dls_resource_data_for_t20s.csv")


def convert_balls_to_overs(balls):
    overs = balls//6 + balls%6 * 0.1
    return overs


def convert_overs_to_balls(overs):
    integer_part = int(overs)
    decimal_part = overs - integer_part
    balls = integer_part * 6 + round(decimal_part * 10)
    return balls


def get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted(
    overs_available_to_team_one,
    runs_scored_by_team_one,
    overs_available_to_team_two_at_start,
    overs_used_by_team_two_until_interruption,
    wickets_lost_by_team_two,
    maximum_overs_allotted_to_team_two_after_resumption
):
    resource_for_0_wickets_lost = resource_table_df["0"][::-1]
    
    balls_available_to_team_one_at_start = convert_overs_to_balls(overs_available_to_team_one)
    balls_available_to_team_two_at_start = convert_overs_to_balls(overs_available_to_team_two_at_start)
    balls_used_by_team_two_until_interruption = convert_overs_to_balls(overs_used_by_team_two_until_interruption)
    balls_remaining_to_team_two_during_interruption = balls_available_to_team_two_at_start - balls_used_by_team_two_until_interruption
    maximum_balls_alloted_to_team_two_after_resumption = convert_overs_to_balls(maximum_overs_allotted_to_team_two_after_resumption)
    balls_remaining_to_team_two_after_resumption = maximum_balls_alloted_to_team_two_after_resumption - balls_used_by_team_two_until_interruption
    
    total_resource_available_to_team_one_at_start = np.interp(
        balls_available_to_team_one_at_start, resource_table_df["balls"][::-1], resource_for_0_wickets_lost
    )
    total_resource_available_to_team_two_at_start = np.interp(
        balls_available_to_team_two_at_start, resource_table_df["balls"][::-1], resource_for_0_wickets_lost
    )
    
    team_two_remaining_resource_during_interruption = np.interp(
        balls_remaining_to_team_two_during_interruption,
        resource_table_df["balls"][::-1],
        resource_table_df[f"{wickets_lost_by_team_two}"][::-1]
    )
    team_two_remaining_resource_during_resumption = np.interp(
        balls_remaining_to_team_two_after_resumption,
        resource_table_df["balls"][::-1],
        resource_table_df[f"{wickets_lost_by_team_two}"][::-1]
    )
    
    resource_lost_by_team_two_due_to_interruption = team_two_remaining_resource_during_interruption - team_two_remaining_resource_during_resumption
    total_resource_remaining_to_team_two = total_resource_available_to_team_two_at_start - resource_lost_by_team_two_due_to_interruption
    
    par_score = runs_scored_by_team_one * (total_resource_remaining_to_team_two/total_resource_available_to_team_one_at_start)
    
    return par_score


def get_par_score_when_first_innings_is_completed_and_second_innings_is_cut_short(
    overs_available_to_team_one,
    runs_scored_by_team_one,
    overs_available_to_team_two_at_start,
    overs_used_by_team_two_until_cutoff,
    wickets_lost_by_team_two
):
    resource_for_0_wickets_lost = resource_table_df["0"][::-1]
    
    balls_available_to_team_one_at_start = convert_overs_to_balls(overs_available_to_team_one)
    balls_available_to_team_two_at_start = convert_overs_to_balls(overs_available_to_team_two_at_start)
    balls_used_by_team_two_until_cutoff = convert_overs_to_balls(overs_used_by_team_two_until_cutoff)
    balls_remaining_to_team_two = balls_available_to_team_two_at_start - balls_used_by_team_two_until_cutoff
    
    total_resource_available_to_team_one_at_start = np.interp(
        balls_available_to_team_one_at_start, resource_table_df["balls"][::-1], resource_for_0_wickets_lost
    )
    total_resource_available_to_team_two_at_start = np.interp(
        balls_available_to_team_two_at_start, resource_table_df["balls"][::-1], resource_for_0_wickets_lost
    )
    
    team_two_remaining_resource = np.interp(
        balls_remaining_to_team_two,
        resource_table_df["balls"][::-1],
        resource_table_df[f"{wickets_lost_by_team_two}"][::-1]
    )
    
    team_two_available_resource = total_resource_available_to_team_two_at_start - team_two_remaining_resource
    
    par_score = runs_scored_by_team_one * (team_two_available_resource/total_resource_available_to_team_one_at_start)
    
    return par_score
