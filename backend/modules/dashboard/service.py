from core.database import get_db


async def get_admin_dashboard_stats():
    db = get_db()

    total_properties = await db.properties.count_documents({})
    active_properties = await db.properties.count_documents({"status": "active"})

    total_inquiries = await db.inquiries.count_documents({})
    new_inquiries = await db.inquiries.count_documents({"stage": "NEW"})

    total_owners = await db.owners.count_documents({})
    total_agents = await db.agents.count_documents({"status": "active"})

    total_users = await db.users.count_documents({"role": "USER"})
    verified_users = await db.users.count_documents({"role": "USER", "email_verified": True})
    total_referrals = await db.users.count_documents(
        {"referred_by": {"$ne": None, "$exists": True}}
    )

    pipeline = [
        {"$group": {"_id": "$property_type", "count": {"$sum": 1}}}
    ]
    type_counts = await db.properties.aggregate(pipeline).to_list(100)
    properties_by_type = {item["_id"]: item["count"] for item in type_counts if item["_id"]}

    recent_inquiries = await db.inquiries.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(5)

    return {
        "total_properties": total_properties,
        "active_properties": active_properties,
        "total_inquiries": total_inquiries,
        "new_inquiries": new_inquiries,
        "total_owners": total_owners,
        "total_agents": total_agents,
        "total_users": total_users,
        "verified_users": verified_users,
        "total_referrals": total_referrals,
        "properties_by_type": properties_by_type,
        "recent_inquiries": recent_inquiries,
    }
