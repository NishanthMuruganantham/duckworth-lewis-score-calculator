
# duckworth-lewis-score-calculator


The Duckworth-Lewis-Stern (DLS) Method Par Score Calculator is a Django website designed to calculate the revised target score for cricket matches affected by rain or interruptions. The DLS Method is a mathematical formula used to adjust the target score based on the number of overs played, wickets lost, and available resources.

## What is the DLS Method?

The Duckworth-Lewis-Stern (DLS) Method is a mathematical model used to calculate target scores in rain-affected limited-overs cricket matches, such as One Day Internationals and T20 Internationals, to determine a fair target score when play is interrupted due to rain or other adverse weather conditions. It takes into account the number of overs remaining, wickets in hand, and resources available to the team batting second, and adjusts the target score accordingly. This method ensures fairness in rain-affected matches by providing a revised target for the chasing team.

## When is the DLS Method Used?

The DLS Method is used when rain or other interruptions affect the progress of a limited-overs cricket match. It helps to determine a revised target for the team batting second based on the resources available to them.

## Importance of Using the DLS Method

Using the DLS Method is crucial in rain-affected matches to ensure fairness and provide a balanced playing field for both teams. Without the DLS Method, the target score would remain unaffected by rain interruptions, leading to potential disadvantages for the team batting second. Here are some key reasons why the DLS Method is important:

<b>Fairness:</b> The DLS Method adjusts the target score based on the resources available to the team batting second, such as the number of overs and wickets remaining. This ensures that both teams have an equal opportunity to compete, regardless of rain interruptions.

<b>Reflects Real-Time Conditions:</b> Rain interruptions can significantly impact the game dynamics, making it challenging for teams to chase a target within reduced playing time. The DLS Method takes into account the actual conditions and provides a revised target that aligns with the match situation.

<b>Maintains Spectacle and Excitement:</b> By adjusting the target score, the DLS Method helps maintain the excitement and competitiveness of the match, even in rain-affected situations. It allows for a thrilling chase and ensures that fans can enjoy an engaging contest.

<b>Preserves Integrity of the Game:</b> Cricket is a sport that values fairness and sportsmanship. The DLS Method plays a crucial role in preserving the integrity of the game by ensuring that rain interruptions do not unfairly disadvantage any team. It provides a standardized approach to calculating target scores in such scenarios.

By using the DLS Method, cricket authorities and teams can uphold the principles of fairness, maintain the excitement of the game, and ensure that rain-affected matches are decided on a level playing field.

## Scenarios for DLS Method Usage


The DLS method can be applied in various scenarios, including:

<ol>
    <li>
        <b>Scenario 1</b>: First innings completed, but the start of the second innings is delayed. Resources reduced at the start of the innings.
    </li>
    <li>
        <b>Scenario 2</b>: First innings completed, but the start of the second innings is curtailed. Resources reduced at the end of the innings.
    </li>
    <li>
        <b>Scenario 3</b>: First innings completed, but the start of the second innings is interrupted, resulting in a reduction in overs. Resources reduced in the middle of the innings.
    </li>
    <li>
        <b>Scenario 4</b>: First innings is curtailed. Resources reduced at the end of the innings.
    </li>
    <li>
        <b>Scenario 5</b>: First innings is interrupted in the middle. Resources reduced in the middle of the innings.
    </li>
</ol>

## Resource Calculation and Par Score Calculation

The DLS method considers the remaining wickets and remaining overs available to a team as the remaining resources. The resource for each available over for each wicket is determined using data from the "dls_resource_data_for_t20s.csv" file.

The website uses numpy interpolation to calculate the exact available resource for each ball based on the data in the file. The calculated resources are then used to determine the par score using the DLS method for the specified scenarios.

## Files and Scripts

The DLS par score calculation scripts for the mentioned scenarios can be found in the "scripts.ipynb" file.

