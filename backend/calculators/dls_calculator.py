"""
Duckworth-Lewis-Stern (DLS) Calculator for T20 Cricket.

This module provides functionality to calculate par scores for cricket matches
when interruptions occur, using the DLS resource table method.
"""

import os
from typing import Union
import pandas as pd
import numpy as np


class DLSCalculator:
    """
    A calculator for computing Duckworth-Lewis-Stern par scores.
    
    The DLS method is used in cricket to set revised targets in matches
    affected by weather interruptions or other delays.
    """
    
    # DLS Resource Table for T20 Cricket
    DLS_RESOURCE_DATA = {
        'balls': [120, 114, 108, 102, 96, 90, 84, 78, 72, 66, 60, 54, 48, 42, 36, 30, 24, 18, 12, 6, 0],
        '0': [100, 96.1, 92.2, 88.2, 84.1, 79.9, 75.4, 71, 66.4, 61.7, 56.7, 51.8, 46.6, 41.3, 35.9, 30.4, 24.6, 18.7, 12.7, 6.4, 0],
        '1': [96.8, 93.3, 89.6, 85.7, 81.8, 77.9, 73.7, 69.4, 65, 60.4, 55.8, 51.1, 45.9, 40.8, 35.5, 30, 24.4, 18.6, 12.5, 6.4, 0],
        '2': [92.6, 89.2, 85.9, 82.5, 79, 75.3, 71.4, 67.3, 63.3, 59, 54.4, 49.8, 45.1, 40.1, 35, 29.7, 24.2, 18.4, 12.5, 6.4, 0],
        '3': [86.7, 83.9, 81.1, 77.9, 74.7, 71.6, 68, 64.5, 60.6, 56.7, 52.7, 48.4, 43.8, 39.2, 34.3, 29.2, 23.9, 18.2, 12.4, 6.4, 0],
        '4': [78.8, 76.7, 74.2, 71.7, 69.1, 66.4, 63.4, 60.4, 57.1, 53.7, 50, 46.1, 42, 37.8, 33.2, 28.4, 23.3, 18, 12.4, 6.4, 0],
        '5': [68.2, 66.6, 65, 63.3, 61.3, 59.2, 56.9, 54.4, 51.9, 49.1, 46.1, 42.8, 39.4, 35.5, 31.4, 27.2, 22.4, 17.5, 12, 6.2, 0],
        '6': [54.4, 53.5, 52.7, 51.6, 50.4, 49.1, 47.7, 46.1, 44.3, 42.4, 40.3, 37.8, 35.2, 32.2, 29, 25.3, 21.2, 16.8, 11.7, 6.2, 0],
        '7': [37.5, 37.3, 36.9, 36.6, 36.2, 35.7, 35.2, 34.5, 33.6, 32.7, 31.6, 30.2, 28.6, 26.9, 24.6, 22.1, 18.9, 15.4, 11, 6, 0],
        '8': [21.3, 21, 21, 21, 20.8, 20.8, 20.8, 20.7, 20.5, 20.3, 20.1, 19.8, 19.3, 18.6, 17.8, 16.6, 14.8, 12.7, 9.7, 5.7, 0],
        '9': [8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.3, 8.1, 8.1, 8, 7.4, 6.5, 4.4, 0]
    }
    
    def __init__(self, resource_table_path: Union[str, None] = None):
        """
        Initialize the DLS Calculator with resource table data.
        
        Args:
            resource_table_path: Optional path to a custom CSV file containing DLS resource data.
                               If None, uses the built-in T20 resource table.
            
        Raises:
            FileNotFoundError: If a custom resource table path is provided but file is not found
        """
        if resource_table_path is not None:
            if not os.path.exists(resource_table_path):
                raise FileNotFoundError(
                    f"Resource table not found at: {resource_table_path}"
                )
            self.resource_table_df = pd.read_csv(resource_table_path)
        else:
            # Use built-in T20 DLS resource table
            self.resource_table_df = pd.DataFrame(self.DLS_RESOURCE_DATA)

    def calculate_par_score(self, scenario: str, **kwargs):

        __func_map = {
            "FirstInningsCurtailed": self.calculate_par_score_first_innings_cut_short,
            "FirstInningsInterrupted": self.calculate_par_score_first_innings_interrupted,
            "SecondInningsCurtailed": self.calculate_par_score_second_innings_cut_short,
            "SecondInningsDelayed": self.calculate_par_score_second_innings_delayed,
            "SecondInningsInterrupted": self.calculate_par_score_second_innings_interrupted
        } 

        func = __func_map.get(scenario)
        if func:
            return func(**kwargs)
        else:
            raise ValueError(f"Invalid scenario: {scenario}")

    def calculate_par_score_first_innings_cut_short(
        self,
        overs_available_to_team_1_at_start: float,
        runs_scored_by_team_1: int,
        wickets_lost_by_team_1: int,
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
            wickets_lost_by_team_1: Wickets lost by Team 1 at cutoff
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
            wickets_lost_by_team_1
        )
        team_one_resource_used = team_one_resource_initially - team_one_resource_remaining
        
        team_two_resource_available = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        
        # Calculate par score using DLS formula
        par_score = runs_scored_by_team_1 + (
            g50_score * (team_two_resource_available - team_one_resource_used) / 100
        )
        
        return round(par_score)

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
    
    def calculate_par_score_second_innings_cut_short(
        self,
        team_one_overs_available: float,
        team_one_runs_scored: int,
        team_two_overs_available_initially: float,
        team_two_overs_used: float,
        team_two_wickets_lost: int
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
        team_one_balls_available = self.convert_overs_to_balls(team_one_overs_available)
        team_two_balls_available = self.convert_overs_to_balls(team_two_overs_available_initially)
        team_two_balls_used = self.convert_overs_to_balls(team_two_overs_used)
        
        balls_remaining = team_two_balls_available - team_two_balls_used
        
        # Get resource percentages
        team_one_resource_available = self._get_resource_percentage(team_one_balls_available, wickets_lost=0)
        team_two_resource_initially = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        team_two_resource_remaining = self._get_resource_percentage(balls_remaining, team_two_wickets_lost)
        
        # Calculate resource used by Team 2
        team_two_resource_used = team_two_resource_initially - team_two_resource_remaining
        
        # Calculate par score
        par_score = team_one_runs_scored * (team_two_resource_used / team_one_resource_available)
        
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
    
    
    
    def calculate_par_score_first_innings_interrupted(
        self,
        team_one_overs_available_initially: float,
        team_one_wickets_lost_at_interruption: int,
        team_one_overs_used_before_interruption: float,
        team_one_overs_available_after_resumption: float,
        team_one_total_runs_scored: int,
        team_two_overs_available: float
    ) -> float:
        """
        Calculate par score when first innings is interrupted and then resumed.
        
        This scenario occurs when Team 1 faces an interruption, resumes with
        reduced overs, completes their innings, and then we set a target for Team 2.
        
        Args:
            team_one_overs_available_initially: Overs available to Team 1 at start
            team_one_wickets_lost_at_interruption: Wickets lost by Team 1 at interruption
            team_one_overs_used_before_interruption: Overs used by Team 1 before interruption
            team_one_overs_available_after_resumption: Maximum overs allotted to Team 1 after resumption
            team_one_total_runs_scored: Total runs scored by Team 1 at end of innings
            team_two_overs_available: Overs available to Team 2
            
        Returns:
            Target score for Team 2
        """
        # Convert overs to balls
        team_one_balls_initially = self.convert_overs_to_balls(team_one_overs_available_initially)
        team_one_balls_used = self.convert_overs_to_balls(team_one_overs_used_before_interruption)
        team_one_balls_after = self.convert_overs_to_balls(team_one_overs_available_after_resumption)
        team_two_balls_available = self.convert_overs_to_balls(team_two_overs_available)
        
        # Calculate balls remaining at different stages
        balls_remaining_during_interruption = team_one_balls_initially - team_one_balls_used
        balls_remaining_after_resumption = team_one_balls_after - team_one_balls_used
        
        # Calculate G50 score (projected score without interruption)
        # Simplified projection based on final run rate
        run_rate = team_one_total_runs_scored / team_one_balls_used if team_one_balls_used > 0 else 0
        g50_score = run_rate * team_one_balls_initially
        
        # Get resource percentages
        team_one_resource_initially = self._get_resource_percentage(team_one_balls_initially, wickets_lost=0)
        team_two_resource_available = self._get_resource_percentage(team_two_balls_available, wickets_lost=0)
        
        team_one_resource_during_interruption = self._get_resource_percentage(
            balls_remaining_during_interruption,
            team_one_wickets_lost_at_interruption
        )
        team_one_resource_after_resumption = self._get_resource_percentage(
            balls_remaining_after_resumption,
            team_one_wickets_lost_at_interruption
        )
        
        # Calculate resource lost due to interruption
        resource_lost = team_one_resource_during_interruption - team_one_resource_after_resumption
        team_one_total_resource = team_one_resource_initially - resource_lost
        
        # Calculate par score using DLS formula
        par_score = team_one_total_runs_scored + (
            g50_score * (team_two_resource_available - team_one_total_resource) / 100
        )
        
        return par_score


# Convenience functions for backward compatibility
def convert_balls_to_overs(balls: int) -> float:
    """Convert balls to overs. See DLSCalculator.convert_balls_to_overs for details."""
    return DLSCalculator.convert_balls_to_overs(balls)


def convert_overs_to_balls(overs: float) -> int:
    """Convert overs to balls. See DLSCalculator.convert_overs_to_balls for details."""
    return DLSCalculator.convert_overs_to_balls(overs)
