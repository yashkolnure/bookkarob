// controllers/subscriptionController.js
export const upgradeStorePlan = async (req, res) => {
  const { planId } = req.body;
  const storeId = req.user.storeId; // From auth middleware

  const plansConfig = {
    pro: { name: 'Professional', durationDays: 30 },
    business: { name: 'Business', durationDays: 365 }
  };

  const selectedPlan = plansConfig[planId];
  if (!selectedPlan) return res.status(400).json({ message: "Invalid Plan" });

  try {
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + selectedPlan.durationDays);

    const updatedStore = await Store.findByIdAndUpdate(storeId, {
      'subscription.planId': planId,
      'subscription.planName': selectedPlan.name,
      'subscription.expiryDate': newExpiry,
      'subscription.status': 'active'
    }, { new: true });

    res.json({ message: "Plan upgraded successfully", store: updatedStore });
  } catch (error) {
    res.status(500).json({ message: "Upgrade failed" });
  }
};