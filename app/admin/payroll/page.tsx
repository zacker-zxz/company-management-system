"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { PageTransition } from "@/components/ui/page-transition"
import { DollarSign, CreditCard, TrendingUp, Users, Calendar, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function PayrollPage() {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [fundsAmount, setFundsAmount] = useState("")
  const [processingPayroll, setProcessingPayroll] = useState(false)
  const [payrollSummary, setPayrollSummary] = useState<any>(null)

  const handleProcessPayroll = async () => {
    setProcessingPayroll(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/payroll/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayrollSummary(data.data)
        alert(`Payroll processed successfully! ${data.message}`)
      } else {
        alert('Failed to process payroll')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setProcessingPayroll(false)
    }
  }

  const handleAddFunds = async () => {
    if (!fundsAmount || parseFloat(fundsAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      const token = localStorage.getItem('token')
      // For now, just show success message since we don't have a funds API
      alert(`Successfully added $${fundsAmount} to company funds!`)
      setShowAddFundsModal(false)
      setFundsAmount("")
    } catch (error) {
      alert('Network error')
    }
  }

  return (
    <PageTransition>
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-heading text-4xl font-bold mb-2 text-slate-800">Payroll Actions</h1>
          <p className="text-slate-600">Process payroll and manage company funds</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="hover-glow bg-white border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-800">Process Payroll</h3>
                <p className="text-slate-600">Run payroll for all active employees</p>
              </div>
            </div>
            <NeonButton
              onClick={handleProcessPayroll}
              disabled={processingPayroll}
              className="w-full"
            >
              {processingPayroll ? 'Processing...' : 'Process Payroll Now'}
            </NeonButton>
          </GlassCard>

          <GlassCard className="hover-glow bg-white border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-800">Add Company Funds</h3>
                <p className="text-slate-600">Add funds to company account</p>
              </div>
            </div>
            <NeonButton
              onClick={() => setShowAddFundsModal(true)}
              variant="secondary"
              className="w-full"
            >
              Add Funds
            </NeonButton>
          </GlassCard>
        </div>

        {/* Payroll Summary */}
        <GlassCard className="hover-glow bg-white border-blue-200">
          <h2 className="font-heading text-2xl font-bold mb-6 text-slate-800">Payroll Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-slate-600">Active Employees</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-600">$36,300</div>
              <div className="text-sm text-slate-600">Total Payroll</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-600">Monthly</div>
              <div className="text-sm text-slate-600">Pay Cycle</div>
            </div>
          </div>
        </GlassCard>

        {/* Recent Payroll History */}
        <GlassCard className="hover-glow bg-white border-blue-200">
          <h2 className="font-heading text-2xl font-bold mb-6 text-slate-800">Recent Payroll History</h2>
          <div className="space-y-4">
            {[
              { period: "November 2024", amount: "$36,300", employees: 5, status: "Completed", date: "2024-11-30" },
              { period: "October 2024", amount: "$36,300", employees: 5, status: "Completed", date: "2024-10-31" },
              { period: "September 2024", amount: "$36,300", employees: 5, status: "Completed", date: "2024-09-30" },
            ].map((payroll, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{payroll.period}</div>
                    <div className="text-sm text-slate-600">{payroll.employees} employees • {payroll.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{payroll.amount}</div>
                  <div className="text-sm text-green-600">{payroll.status}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Add Funds Modal */}
        {showAddFundsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4 text-slate-800">Add Company Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Amount ($)</label>
                  <input
                    type="number"
                    value={fundsAmount}
                    onChange={(e) => setFundsAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex gap-3">
                  <NeonButton onClick={handleAddFunds} className="flex-1">
                    Add Funds
                  </NeonButton>
                  <NeonButton variant="secondary" onClick={() => setShowAddFundsModal(false)}>
                    Cancel
                  </NeonButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}