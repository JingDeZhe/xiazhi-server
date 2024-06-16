import { db } from '../../db/douban.mjs'
import dayjs from 'dayjs'

/**
 * 供AG Grid服务端模型使用的数据服务
 */
class Service {
  constructor() {}

  async getData(req) {
    const builder = this.buildSql(req).limit(100)
    const rows = await builder.from('films')
    const rowCount = this.getRowCount(req, rows)
    const rowData = this.cutRowsToPage(req, rows)
    this.formatRows(rowData)
    return { rowData, rowCount }
  }

  buildSql(req) {
    this.builder = db.where(true)
    this.createSelectSql(req)
    this.createWhereSql(req)
    this.createLimitSql(req)
    this.createOrderBySql(req)
    this.createGroupBySql(req)
    console.log(this.builder.toSQL().toNative())
    return this.builder
  }

  createSelectSql(req) {
    const { rowGroupCols, valueCols, groupKeys } = req
    const colsToSelect = []
    if (this.isDoingGroup(rowGroupCols, groupKeys)) {
      const rowGroupCol = rowGroupCols[groupKeys.length]
      colsToSelect.push(rowGroupCol.field)

      for (const valueCol of valueCols) {
        colsToSelect.push(`${valueCol.aggFunc}(${valueCol.field})`)
      }
    }

    return this.builder.select(colsToSelect)
  }

  createWhereSql(req) {
    const { rowGroupCols, groupKeys, filterModel } = req

    if (groupKeys.length > 0) {
      groupKeys.forEach((key, index) => {
        const colName = rowGroupCols[index].field
        this.builder.andWhere(colName, key)
      })
    }

    if (filterModel) {
      for (const [k, v] of Object.entries(filterModel)) {
        this.createFilterSql(k, v)
      }
    }
  }

  createFilterSql(key, item) {
    switch (item.filterType) {
      case 'text':
        this.createTextFilterSql(key, item)
        break
      case 'number':
        this.createNumberFilterSql(key, item)
        break
      default:
        console.log('unkonwn filter type: ' + item.filterType)
    }
  }

  createTextFilterSql(key, item) {
    const value = item.filter
    switch (item.type) {
      case 'equals':
        this.builder.where(key, value)
        break
      case 'notEqual':
        this.builder.whereNot(key, value)
        break
      case 'contains':
        this.builder.where(key, 'like', `%${value}%`)
        break
      case 'notContains':
        this.builder.whereNot(key, 'like', `%${value}%`)
        break
      case 'startsWith':
        this.builder.where(key, 'like', `${value}%`)
        break
      case 'endsWith':
        this.builder.where(key, 'like', `%${value}`)
        break
      default:
        console.log('unknown number filter type: ' + item.type)
    }
  }

  createNumberFilterSql(key, item) {
    const value = item.filter
    switch (item.type) {
      case 'equals':
        this.builder.where(key, value)
        break
      case 'notEqual':
        this.builder.whereNot(key, value)
        break
      case 'greaterThan':
        this.builder.where(key, '>', value)
        break
      case 'greaterThanOrEqual':
        this.builder.where(key, '>=', value)
        break
      case 'lessThan':
        this.builder.where(key, '<', value)
        break
      case 'lessThanOrEqual':
        this.builder.where(key, '<=', value)
        break
      case 'inRange':
        this.builder.whereBetween(key, [item.filter, item.filterTo])
        break
      default:
        console.log('unknown text filter type: ' + item.type)
    }
  }

  createLimitSql(req) {
    const { startRow, endRow } = req
    const pageSize = endRow - startRow
    this.builder.limit(pageSize + 1).offset(startRow)
  }

  createOrderBySql(req) {
    const { rowGroupCols, groupKeys, sortModel } = req
    const grouping = this.isDoingGroup(rowGroupCols, groupKeys)
    if (sortModel) {
      const groupColIds = rowGroupCols.map((d) => d.id).slice(0, groupKeys.length + 1)
      for (const item of sortModel) {
        if (grouping && groupColIds.includes(item.colId)) {
          // 排序的字段是Group的，不做处理
        } else {
          this.builder.orderBy(item.colId, item.sort)
        }
      }
    }
  }

  createGroupBySql(req) {
    const { rowGroupCols, groupKeys } = req
    if (this.isDoingGroup(rowGroupCols, groupKeys)) {
      const rowGroupCol = rowGroupCols[groupKeys.length]
      this.builder.groupBy(rowGroupCol.field)
    }
  }

  isDoingGroup(rowGroupCols, groupKeys) {
    return rowGroupCols.length > groupKeys.length
  }

  getRowCount(req, rows) {
    if (rows?.length > 0) {
      const nextLastRow = req.startRow + rows.length
      // 因为每页数量固定，req.endRow请求的时候就确定了
      return nextLastRow <= req.endRow ? nextLastRow : -1
    }
    return null
  }

  cutRowsToPage(req, rows) {
    const pageSize = req.endRow - req.startRow
    if (rows?.length > pageSize) {
      return rows.slice(0, pageSize)
    }
    return rows
  }

  formatRows(rows) {
    for (const row of rows) {
      row.year = parseInt(row.year)
    }
    return rows
  }
}

export const service = new Service()
