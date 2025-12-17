"""
Duckworth-Lewis-Stern (DLS) Calculator.

This module provides functionality to calculate par scores for cricket matches
when interruptions occur, using the DLS resource table method.
"""

import os
from typing import Union
import pandas as pd
import numpy as np
from calculators.resource_table import ResourceTable


class DLSCalculator:
    """
    A calculator for computing Duckworth-Lewis-Stern par scores.
    
    The DLS method is used in cricket to set revised targets in matches
    affected by weather interruptions or other delays.
    """
    
    def __init__(self, match_type: str = 'T20'):
        """
        Initialize the DLS Calculator with resource table data.
        
        Args:
            match_type (str): The match type, e.g., 'T20' or 'ODI'.
        """
        self.resource_table = ResourceTable(match_type)
        self.resource_table_df = self.resource_table.resource_df

    def calculate_par_score_first_innings_cut_short(
        self,
        overs_available_to_team_1_at_start: float,
        runs_scored_by_team_1: int,
        wickets_lost_by_team_1_during_curtailed: int,
        overs_used_by_team_1_during_curtailed: float,
        overs_available_to_team_2_at_start: float,
        **kwargs
    ) -> float:
        """
        Calculate par score when first innings is cut short.
        
        This scenario occurs when Team 1's innings is prematurely ended,
        and we need to set a fair target for Team 2.
        
        Args:
            overs_available_to_team_1_at_start: Overs available to Team 1 at start
            runs_scored_by_team_1: Runs scored by Team 1 before cutoff
            wickets_lost_by_team_1_during_curtailed: Wickets lost by Team 1 at cutoff
            overs_used_by_team_1_during_curtailed: Overs used by Team 1 until cutoff
            overs_available_to_team_2_at_start: Overs available to Team 2
            
        Returns:
            Target score for Team 2
        """
        # Convert overs to balls
        team_one_balls_initially = self.convert_overs_to_balls(overs_available_to_team_1_at_start)
        team_one_balls_used = self.convert_overs_to_balls(overs_used_by_team_1_during_curtailed)
        team_two_balls_available = self.convert_overs_to_balls(overs_available_to_team_2_at_start)
        
        balls_remaining_team_one = team_one_balls_initially - team_one_balls_used
        
        # Calculate G50 score (projected score if Team 1 had completed their innings)
        # This is a simplified projection based on current run rate
        run_rate = runs_scored_by_team_1 / team_one_balls_used if team_one_balls_used > 0 else 0
        g50_score = run_rate * team_one_balls_initially
        
        # Get resource percentages
        team_one_resource_initially = self._get_resource_percentage(team_one_balls_initially, wickets_lost=0)
        team_one_resource_remaining = self._get_resource_percentage(
            balls_remaining_team_one, 
            wickets_lost_by_team_1_during_curtailed
        )
        team_one_resource_used = team_one_resource_initially - team_one_resource_remaining
        
        team_two_resource_available = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        
        # Calculate par score using DLS formula
        par_score = runs_scored_by_team_1 + (
            g50_score * (team_two_resource_available - team_one_resource_used) / 100
        )
        
        return round(par_score)

    def calculate_par_score_first_innings_interrupted(
        self,
        overs_available_to_team_1_at_start: float,
        wickets_lost_by_team_1_during_interruption: int,
        overs_used_by_team_1_during_interruption: float,
        overs_available_to_team_1_at_resumption: float,
        runs_scored_by_team_1: int,
        overs_available_to_team_2_at_start: float,
        **kwargs
    ) -> float:
        """
        Calculate par score when first innings is interrupted and then resumed.
        
        This scenario occurs when Team 1 faces an interruption, resumes with
        reduced overs, completes their innings, and then we set a target for Team 2.
        
        Args:
            overs_available_to_team_1_at_start: Overs available to Team 1 at start
            wickets_lost_by_team_1_during_interruption: Wickets lost by Team 1 at interruption
            overs_used_by_team_1_during_interruption: Overs used by Team 1 before interruption
            overs_available_to_team_1_at_resumption: Maximum overs allotted to Team 1 after resumption
            runs_scored_by_team_1: Total runs scored by Team 1 at end of innings
            overs_available_to_team_2_at_start: Overs available to Team 2
            
        Returns:
            Target score for Team 2
        """
        # Convert overs to balls
        team_one_balls_initially = self.convert_overs_to_balls(overs_available_to_team_1_at_start)
        team_one_balls_used = self.convert_overs_to_balls(overs_used_by_team_1_during_interruption)
        team_one_balls_after = self.convert_overs_to_balls(overs_available_to_team_1_at_resumption)
        team_two_balls_available = self.convert_overs_to_balls(overs_available_to_team_2_at_start)
        
        # Calculate balls remaining at different stages
        balls_remaining_during_interruption = team_one_balls_initially - team_one_balls_used
        balls_remaining_after_resumption = team_one_balls_after - team_one_balls_used
        
        # Calculate G50 score (projected score without interruption)
        # Simplified projection based on final run rate
        run_rate = runs_scored_by_team_1 / team_one_balls_used if team_one_balls_used > 0 else 0
        g50_score = run_rate * team_one_balls_initially
        
        # Get resource percentages
        team_one_resource_initially = self._get_resource_percentage(team_one_balls_initially, wickets_lost=0)
        team_two_resource_available = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        
        team_one_resource_during_interruption = self._get_resource_percentage(
            balls_remaining_during_interruption,
            wickets_lost_by_team_1_during_interruption
        )
        team_one_resource_after_resumption = self._get_resource_percentage(
            balls_remaining_after_resumption,
            wickets_lost_by_team_1_during_interruption
        )
        
        # Calculate resource lost due to interruption
        resource_lost = team_one_resource_during_interruption - team_one_resource_after_resumption
        team_one_total_resource = team_one_resource_initially - resource_lost
        
        # Calculate par score using DLS formula
        par_score = runs_scored_by_team_1 + (
            g50_score * (team_two_resource_available - team_one_total_resource) / 100
        )
        
        return par_score

    def calculate_par_score_second_innings_cut_short(
        self,
        overs_available_to_team_1_at_start: float,
        runs_scored_by_team_1: int,
        overs_available_to_team_2_at_start: float,
        overs_used_by_team_2_during_curtailed: float,
        wickets_lost_by_team_2_during_curtailed: int,
        **kwargs
    ) -> float:
        """
        Calculate par score when first innings is completed and second innings is cut short.
        
        This scenario occurs when Team 2's innings is prematurely ended (e.g., rain)
        and there's no resumption.
        
        Args:
            team_one_overs_available: Overs available to Team 1
            team_one_runs_scored: Total runs scored by Team 1
            team_two_overs_available_initially: Overs available to Team 2 at start
            team_two_overs_used: Overs used by Team 2 until cutoff
            team_two_wickets_lost: Wickets lost by Team 2 at cutoff
            
        Returns:
            Par score for Team 2 at the cutoff point
        """
        # Convert overs to balls
        team_one_balls_available = self.convert_overs_to_balls(overs_available_to_team_1_at_start)
        team_two_balls_available = self.convert_overs_to_balls(overs_available_to_team_2_at_start)
        team_two_balls_used = self.convert_overs_to_balls(overs_used_by_team_2_during_curtailed)
        
        balls_remaining = team_two_balls_available - team_two_balls_used
        
        # Get resource percentages
        team_one_resource_available = self._get_resource_percentage(team_one_balls_available, wickets_lost=0)
        team_two_resource_initially = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        team_two_resource_remaining = self._get_resource_percentage(balls_remaining, wickets_lost_by_team_2_during_curtailed)
        
        # Calculate resource used by Team 2
        team_two_resource_used = team_two_resource_initially - team_two_resource_remaining
        
        # Calculate par score
        par_score = runs_scored_by_team_1 * (team_two_resource_used / team_one_resource_available)
        
        return par_score

    @staticmethod
    def convert_balls_to_overs(balls: int) -> float:
        """
        Convert number of balls to overs.
        
        Args:
            balls: Total number of balls
            
        Returns:
            Number of overs in decimal format (e.g., 10.3 for 10 overs and 3 balls)
        """
        complete_overs = balls // 6
        remaining_balls = balls % 6
        return complete_overs + remaining_balls * 0.1
    
    @staticmethod
    def convert_overs_to_balls(overs: float) -> int:
        """
        Convert overs to number of balls.
        
        Args:
            overs: Number of overs in decimal format (e.g., 10.3)
            
        Returns:
            Total number of balls
        """
        complete_overs = int(overs)
        decimal_part = overs - complete_overs
        remaining_balls = round(decimal_part * 10)
        return complete_overs * 6 + remaining_balls
    
    def _get_resource_percentage(
        self, 
        balls_remaining: int, 
        wickets_lost: int
    ) -> float:
        """
        Get resource percentage from the DLS table for given conditions.
        
        Args:
            balls_remaining: Number of balls remaining in the innings
            wickets_lost: Number of wickets already lost
            
        Returns:
            Resource percentage available
        """
        wicket_column = str(wickets_lost)
        reversed_balls = self.resource_table_df["balls"][::-1]
        reversed_resources = self.resource_table_df[wicket_column][::-1]
        
        return np.interp(balls_remaining, reversed_balls, reversed_resources)
    
    def calculate_par_score_second_innings_interrupted(
        self,
        team_one_overs_available: float,
        team_one_runs_scored: int,
        team_two_overs_available_initially: float,
        team_two_overs_used_before_interruption: float,
        team_two_wickets_lost: int,
        team_two_overs_available_after_resumption: float
    ) -> float:
        """
        Calculate par score when first innings is completed and second innings is interrupted.
        
        This scenario occurs when Team 2 faces an interruption during their chase,
        and the match resumes with reduced overs.
        
        Args:
            team_one_overs_available: Overs available to Team 1 at start
            team_one_runs_scored: Total runs scored by Team 1
            team_two_overs_available_initially: Overs available to Team 2 at start
            team_two_overs_used_before_interruption: Overs used by Team 2 before interruption
            team_two_wickets_lost: Wickets lost by Team 2 at time of interruption
            team_two_overs_available_after_resumption: Maximum overs allotted to Team 2 after resumption
            
        Returns:
            Par score for Team 2 to win
        """
        # Convert overs to balls for precise calculations
        team_one_balls_available = self.convert_overs_to_balls(team_one_overs_available)
        team_two_balls_available_initially = self.convert_overs_to_balls(team_two_overs_available_initially)
        team_two_balls_used = self.convert_overs_to_balls(team_two_overs_used_before_interruption)
        team_two_balls_available_after = self.convert_overs_to_balls(team_two_overs_available_after_resumption)
        
        # Calculate balls remaining at different stages
        balls_remaining_during_interruption = team_two_balls_available_initially - team_two_balls_used
        balls_remaining_after_resumption = team_two_balls_available_after - team_two_balls_used
        
        # Get resource percentages
        team_one_resource_available = self._get_resource_percentage(team_one_balls_available, wickets_lost=0)
        team_two_resource_initially = self._get_resource_percentage(team_two_balls_available_initially, wickets_lost=0)
        
        team_two_resource_during_interruption = self._get_resource_percentage(
            balls_remaining_during_interruption, 
            team_two_wickets_lost
        )
        team_two_resource_after_resumption = self._get_resource_percentage(
            balls_remaining_after_resumption, 
            team_two_wickets_lost
        )
        
        # Calculate resource lost due to interruption
        resource_lost = team_two_resource_during_interruption - team_two_resource_after_resumption
        team_two_total_resource = team_two_resource_initially - resource_lost
        
        # Calculate par score
        par_score = team_one_runs_scored * (team_two_total_resource / team_one_resource_available)
        
        return par_score
    
    def calculate_par_score_second_innings_delayed(
        self,
        team_one_overs_available: float,
        team_one_runs_scored: int,
        team_two_overs_available: float
    ) -> float:
        """
        Calculate par score when first innings is completed and second innings is delayed.
        
        This scenario occurs when Team 2 starts with fewer overs than Team 1 had,
        but faces no further interruptions.
        
        Args:
            team_one_overs_available: Overs available to Team 1
            team_one_runs_scored: Total runs scored by Team 1
            team_two_overs_available: Overs available to Team 2 at start
            
        Returns:
            Revised target for Team 2
        """
        # Convert overs to balls
        team_one_balls_available = self.convert_overs_to_balls(team_one_overs_available)
        team_two_balls_available = self.convert_overs_to_balls(team_two_overs_available)
        
        # Get resource percentages (both teams start with 0 wickets lost)
        team_one_resource = self._get_resource_percentage(team_one_balls_available, wickets_lost=0)
        team_two_resource = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        
        # Calculate revised target
        par_score = team_one_runs_scored * (team_two_resource / team_one_resource)
        
        return par_score
    
    
    
    


# Convenience functions for backward compatibility
def convert_balls_to_overs(balls: int) -> float:
    """Convert balls to overs. See DLSCalculator.convert_balls_to_overs for details."""
    return DLSCalculator.convert_balls_to_overs(balls)


def convert_overs_to_balls(overs: float) -> int:
    """Convert overs to balls. See DLSCalculator.convert_overs_to_balls for details."""
    return DLSCalculator.convert_overs_to_balls(overs)
