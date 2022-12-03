import { observer } from 'mobx-react'
import { FieldContainer } from '../../../common/Form/FieldContainer'
import { Select } from 'oa-components'
import { useCommonStores } from 'src'

export const CategoriesSelect = observer(
  ({ value, onChange, placeholder, isForm, type }) => {
    let categories
    if (type === 'how-to-categories') {
      const { categoriesStore } = useCommonStores().stores
      categories = categoriesStore.allCategories
    } else if (type === 'research-categories') {
      const { researchCategoriesStore } = useCommonStores().stores
      categories = researchCategoriesStore.allResearchCategories
    }

    const selectOptions = categories.map((category) => ({
      value: { ...category },
      label: category.label,
    }))
    const handleChange = (changedValue) => {
      onChange(changedValue?.value ?? null)
    }

    return (
      <FieldContainer
        data-cy={categories ? 'category-select' : 'category-select-empty'}
      >
        <Select
          variant={isForm ? 'form' : undefined}
          options={selectOptions}
          placeholder={placeholder}
          value={value ? value : null}
          onChange={handleChange}
          isClearable={true}
        />
      </FieldContainer>
    )
  },
)
