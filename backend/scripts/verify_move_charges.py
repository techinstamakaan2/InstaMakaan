import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from core.database import get_db
from modules.properties.service import get_property_by_id, create_property, delete_property
from modules.properties.schemas import PropertyCreate

async def verify():
    db = get_db()
    # 1. Check existing rental properties
    async for prop in db.properties.find({"property_type": "rent"}, {"title": 1, "id": 1, "move_charge": 1, "_id": 0}):
        print(f"Existing DB Property: '{prop.get('title')}' -> move_charge: {prop.get('move_charge')}")
        fetched = await get_property_by_id(prop["id"])
        print(f"Service returned move_charge: {fetched.get('move_charge')}")
        assert fetched.get("move_charge") == "3000"

    # 2. Test create new rental property without move_charge -> should auto-default to '3000'
    test_data = PropertyCreate(
        title="Test Rental Property For Verification",
        property_type="rent",
        location="Sector 1, Greater Noida",
        price="20000",
        price_label="Full Flat Rent",
        description="Auto test property",
        beds=2,
        baths=2,
        area="1000 sq.ft",
    )
    new_prop = await create_property(test_data, user={"id": "admin_test", "role": "admin"})
    print(f"Newly Created Property: '{new_prop.get('title')}' -> move_charge: {new_prop.get('move_charge')}")
    assert new_prop.get("move_charge") == "3000", f"Expected 3000, got {new_prop.get('move_charge')}"

    # Clean up test property
    await delete_property(new_prop["id"])
    print("Test property cleaned up successfully.")
    print("ALL VERIFICATIONS PASSED!")

if __name__ == "__main__":
    asyncio.run(verify())
