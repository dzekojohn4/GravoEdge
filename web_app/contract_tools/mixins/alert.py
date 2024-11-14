"""
This module contains the alert mixin class.
"""
from typing import List
from web_app.db.crud import UserDBConnector
from web_app.db.models import Status
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.contract_tools.mixins.custom_exception import HealthRatioLevelLowException

ALERT_THRESHOLD = 1.1

class AlertMixin:
    """
    Mixin class for alert related methods.
    """

    def check_users_health_ratio_level(self) -> None:
        """
        Check the health ratio level for all users with an OPENED position.
        If a user's health ratio level is lower than 1.1, raise a `HealthRatioLevelLowException`.
        """

        users = UserDBConnector().get_all_users_with_opened_position()

        for user in users:
            zk_lend_position = DashboardMixin.get_zklend_position(user.contract_address)

            health_ratio_level = zk_lend_position.health_ratio_level
            if health_ratio_level < ALERT_THRESHOLD:
                raise HealthRatioLevelLowException(user.id, health_ratio_level)