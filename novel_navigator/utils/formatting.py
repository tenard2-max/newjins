"""표시용 포맷 유틸리티."""

from __future__ import annotations


def format_won(amount: int | float) -> str:
    """원화 금액을 한국식 억/조 단위로 변환."""
    if amount is None:
        return "-"
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return str(amount)

    if amount >= 1_0000_0000_0000_0000:  # 1경 이상
        return f"{amount / 1_0000_0000_0000_0000:.2f}경 원"
    if amount >= 1_0000_0000_0000:  # 1조 이상
        return f"{amount / 1_0000_0000_0000:.2f}조 원"
    if amount >= 1_0000_0000:  # 1억 이상
        return f"{amount / 1_0000_0000:.2f}억 원"
    if amount >= 1_0000:
        return f"{amount / 1_0000:.2f}만 원"
    return f"{int(amount):,}원"


def progress_ratio(current: float, target: float) -> float:
    if not target:
        return 0.0
    ratio = current / target
    return max(0.0, min(1.0, ratio))
