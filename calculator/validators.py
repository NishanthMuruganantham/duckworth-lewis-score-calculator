def decimal_validator(overs):
    integer_part = int(overs)
    decimal_part = overs - integer_part
    if 0.0 <= decimal_part <= 0.5:
        return True
    return False
