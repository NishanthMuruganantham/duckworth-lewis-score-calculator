import pandas as pd
import numpy as np


resource_table_df = pd.read_csv(f"dls_resource_data_for_t20s.csv")


def convert_overs_to_balls(overs):
    integer_part = int(overs)
    decimal_part = overs - integer_part
    balls = integer_part * 6 + round(decimal_part * 10)
    return balls


def get_par_score_when_first_innings_is_completed_and_second_innings_is_interrupted(
    overs_available_to_team_one,
    runs_scored_by_team_one,
    overs_available_to_team_two_at_start,
    overs_remaining_to_team_two_during_interruption,
    wickets_lost_by_team_two,
    overs_remaining_to_team_two_during_resumption
):
    resource_for_0_wickets_lost = resource_table_df["0"][::-1]
    
    total_resource_available_to_team_one_at_start = np.interp(
        convert_overs_to_balls(overs_available_to_team_one), resource_table_df["balls"][::-1], resource_for_0_wickets_lost
    )
    total_resource_available_to_team_two_at_start = np.interp(
        convert_overs_to_balls(overs_available_to_team_two_at_start), resource_table_df["balls"][::-1], resource_for_0_wickets_lost
    )
    
    team_two_remaining_resource_during_interruption = np.interp(
        convert_overs_to_balls(overs_remaining_to_team_two_during_interruption),
        resource_table_df["balls"][::-1],
        resource_table_df[f"{wickets_lost_by_team_two}"][::-1]
    )
    team_two_remaining_resource_during_resumption = np.interp(
        convert_overs_to_balls(overs_remaining_to_team_two_during_resumption),
        resource_table_df["balls"][::-1],
        resource_table_df[f"{wickets_lost_by_team_two}"][::-1]
    )
    
    resource_lost_by_team_two_due_to_interruption = team_two_remaining_resource_during_interruption - team_two_remaining_resource_during_resumption
    total_resource_remaining_to_team_two = total_resource_available_to_team_two_at_start - resource_lost_by_team_two_due_to_interruption
    
    par_score = runs_scored_by_team_one * (total_resource_remaining_to_team_two/total_resource_available_to_team_one_at_start)
    
    return par_score
