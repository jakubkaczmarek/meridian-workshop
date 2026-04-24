<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-bar card">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-group">
        <span class="currency-prefix">{{ currencySymbol }}</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="100"
          :placeholder="t('restocking.budgetPlaceholder')"
          class="budget-input"
          @keydown.enter="applyBudget"
        />
      </div>
      <button class="apply-btn" @click="applyBudget">{{ t('restocking.applyBudget') }}</button>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card info">
          <div class="stat-label">{{ t('restocking.itemsRecommended') }}</div>
          <div class="stat-value">{{ summary.total_items }}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ summary.total_cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </div>
        <div v-if="appliedBudget > 0" class="stat-card success">
          <div class="stat-label">{{ t('restocking.withinBudgetTotal') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ summary.total_cost_within_budget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </div>
      </div>

      <div v-if="recommendations.length === 0" class="empty-state card">
        {{ t('restocking.noItems') }}
      </div>

      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }} ({{ recommendations.length }})</h3>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.product') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.shortage') }}</th>
                <th>{{ t('restocking.table.forecastedDemand') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.priority') }}</th>
                <th v-if="appliedBudget > 0">{{ t('restocking.table.budgetStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.sku"
                :class="{ 'row-over-budget': appliedBudget > 0 && !item.within_budget }"
              >
                <td><strong>{{ item.sku }}</strong></td>
                <td>{{ translateProductName(item.name) }}</td>
                <td>{{ translateCategory(item.category) }}</td>
                <td>{{ translateWarehouse(item.warehouse) }}</td>
                <td><strong>{{ item.quantity_on_hand }}</strong></td>
                <td>{{ item.reorder_point }}</td>
                <td>
                  <strong v-if="item.shortage > 0" class="shortage-value">{{ item.shortage }}</strong>
                  <span v-else>—</span>
                </td>
                <td>{{ item.forecasted_demand }}</td>
                <td><strong>{{ item.recommended_qty }}</strong></td>
                <td>{{ currencySymbol }}{{ item.unit_cost.toFixed(2) }}</td>
                <td><strong>{{ currencySymbol }}{{ item.estimated_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</strong></td>
                <td>
                  <span :class="['badge', item.priority]">
                    {{ t(`priority.${item.priority}`) }}
                  </span>
                </td>
                <td v-if="appliedBudget > 0">
                  <span :class="['badge', item.within_budget ? 'success' : 'danger']">
                    {{ item.within_budget ? t('restocking.budgetStatus.withinBudget') : t('restocking.budgetStatus.overBudget') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, translateProductName, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const summary = ref({ total_items: 0, total_cost: 0, items_within_budget: 0, total_cost_within_budget: 0 })
    const budgetInput = ref(0)
    const appliedBudget = ref(0)

    const translateCategory = (category) => {
      const map = {
        'Circuit Boards': t('categories.circuitBoards'),
        'Sensors': t('categories.sensors'),
        'Actuators': t('categories.actuators'),
        'Controllers': t('categories.controllers'),
        'Power Supplies': t('categories.powerSupplies')
      }
      return map[category] || category
    }

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        const result = await api.getRestockingRecommendations(appliedBudget.value, {
          warehouse: filters.warehouse,
          category: filters.category
        })
        recommendations.value = result.items
        summary.value = result.summary
      } catch (err) {
        error.value = 'Failed to load restocking recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      appliedBudget.value = parseFloat(budgetInput.value) || 0
      loadRecommendations()
    }

    watch([selectedLocation, selectedCategory], loadRecommendations)
    onMounted(loadRecommendations)

    return {
      t,
      loading,
      error,
      recommendations,
      summary,
      budgetInput,
      appliedBudget,
      currencySymbol,
      translateProductName,
      translateWarehouse,
      translateCategory,
      applyBudget
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-prefix {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  pointer-events: none;
}

.budget-input {
  padding: 0.5rem 0.75rem 0.5rem 1.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  width: 220px;
  transition: all 0.2s;
}

.budget-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.apply-btn {
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-btn:hover {
  background: #1d4ed8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #059669;
  font-weight: 600;
  font-size: 1.125rem;
}

.shortage-value {
  color: #dc2626;
}

.row-over-budget td {
  color: #94a3b8;
}

.row-over-budget strong {
  color: #94a3b8;
}

.row-over-budget .badge {
  opacity: 0.7;
}
</style>
