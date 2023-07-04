import React, { useState, useEffect } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Table } from "reactstrap";

function _selector(row) {
  if (row?.custom && row?.customItem) {
    return row?.customItem();
  } else {
    return row ?? "-";
  }
}
const _header = [
  {
    id: 0,
    label: "No",
    hidden: false,
    custom: false,
    customheader: () => <th>Custom Header</th>,
    selector: (row) => row.no,
    right: true,
    sortable: false,
    sortId: "no",
    sticky: true,
  },
];

const _data = [
  {
    no: 1,
    nama: {
      custom: true,
      customItem: () => <td>Custom Item</td>,
    },
  },
];

function TableGeneral({
  data = _data,
  header = _header,
  selectableRows = false,
  rowCount = 10,
  handleSelect = "",
  handleSort = "",
  onClickRow = "",
}) {
  const [items, setItems] = useState([]);
  const [isSelectAll, setSelectAll] = useState(false);
  const [checkboxIds, setCheckboxIds] = useState([]);
  const [sorting, setSorting] = useState({ id: "", sort: "" });

  function IconSort({ id = "", sort = "" }) {
    return (
      <span
        onClick={() => handleSortColumn({ id, sort })}
        style={{ color: "#FFFFFF" }}
      >
        {sort === "asc" ? (
          <FaSortDown size={16} />
        ) : sort === "desc" ? (
          <FaSortUp size={16} />
        ) : (
          <FaSort size={16} />
        )}
      </span>
    );
  }

  function handleSortColumn({ id = "", sort = "" }) {
    let _sort = "";
    if (sort === "") {
      _sort = "asc";
    } else if (sort === "asc") {
      _sort = "desc";
    } else {
      _sort = "";
    }
    setSorting({ id, sort: _sort });
    if (typeof handleSort === "function") {
      handleSort({ id, sort: _sort });
    }
  }

  const handleSelectAll = () => {
    let _checkboxIds = [];
    if (isSelectAll) {
      const itemsUncheck = items.map((item) => item.id);
      _checkboxIds = checkboxIds.filter((id) => !itemsUncheck.includes(id));
      setCheckboxIds(_checkboxIds);
    } else {
      const itemsChecked = items.map((item) => item.id);
      _checkboxIds = [...new Set([...checkboxIds, ...itemsChecked])];
      setCheckboxIds(_checkboxIds);
    }

    if (typeof handleSelect === "function") {
      const selectionIds = _checkboxIds.filter(
        (ids) => ids !== null && ids !== undefined && ids !== {} && ids !== ""
      );
      const selection = selectionIds;
      handleSelect(selection);
    }
  };

  const handleSelectRow = (index) => {
    let _checkboxIds = [];
    if (checkboxIds.includes(items[index].id)) {
      _checkboxIds = checkboxIds.filter((ids) => ids !== items[index].id);
    } else {
      _checkboxIds = [...checkboxIds, items[index].id];
    }
    const itemChecked = _checkboxIds.filter(
      (ids) => ids !== null && ids !== undefined && ids !== {} && ids !== ""
    );
    setCheckboxIds(_checkboxIds);
    setSelectAll(itemChecked.length === rowCount);
    if (typeof handleSelect === "function") {
      const selection = itemChecked;
      handleSelect(selection);
    }
  };

  useEffect(() => {
    setItems(data);
    const itemChecked = checkboxIds
      .map((ids) => data.find((item) => item.id === ids))
      .filter(
        (ids) => ids !== null && ids !== undefined && ids !== {} && ids !== ""
      );
    setSelectAll(itemChecked.length === rowCount);
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    setCheckboxIds([]);
  }, [selectableRows]);

  const DataTable = () => {
    return items.length > 0
      ? items.map((dataItem, idxDataItem) => {
          return idxDataItem < rowCount ? (
            <tr
              key={"dataItem-" + idxDataItem}
              style={{
                background: checkboxIds.includes(dataItem.id) ? "#DEF6FC" : "",
                cursor: typeof onClickRow === "function" ? "pointer" : "",
              }}
              onClick={typeof onClickRow === "function" ? () => onClickRow(dataItem) : ""}
            >
              {selectableRows && (
                <td
                  style={{
                    fontWeight: 400,
                    position: "sticky",
                    left: 0.1,
                    background: checkboxIds.includes(dataItem.id)
                      ? "#DEF6FC"
                      : !(idxDataItem % 2 === 0)
                      ? "#FFFFFF"
                      : "#F4F4F4",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={() => handleSelectRow(idxDataItem)}
                    checked={checkboxIds.includes(dataItem.id)}
                  />
                </td>
              )}
              {header.length > 0
                ? header
                    .filter((head) => !head.hidden || false)
                    .map((item, idxItem) => {
                      return (
                        <td
                          key={"item-" + idxItem}
                          style={{
                            whiteSpace: "nowrap",
                            textAlign: item?.right ? "right" : "left",
                            position: item?.sticky ? "sticky" : "unset",
                            background: checkboxIds.includes(dataItem.id)
                              ? "#DEF6FC"
                              : !(idxDataItem % 2 === 0)
                              ? "#FFFFFF"
                              : "#F4F4F4",
                            right:
                              header.findIndex(
                                (_head) => item.id === _head.id
                              ) >
                              header.length / 2
                                ? 0.1
                                : 0,
                            left:
                              header.findIndex(
                                (_head) => item.id === _head.id
                              ) <
                              header.length / 2
                                ? selectableRows
                                  ? 37
                                  : 0.1
                                : 0,
                          }}
                        >
                          {_selector(item.selector(dataItem))}
                        </td>
                      );
                    })
                : null}
            </tr>
          ) : null;
        })
      : null;
  };

  return (
    <Table
      style={{
        background: "#FFFFFF",
        position: "sticky",
        top: 0,
        overflow: "scroll",
        width: "100%",
      }}
      striped
      borderless
    >
      <thead
        style={{
          fontSize: "14px",
          background: "#0D2555",
        }}
      >
        <tr>
          {selectableRows && (
            <th
              style={{
                padding: "6px 12px",
                textAlign: "center",
                background: "#0D2555",
                position: "sticky",
                left: 0.1,
              }}
            >
              <input
                type="checkbox"
                onChange={handleSelectAll}
                name="checkAll"
                id="checkAll"
                checked={isSelectAll}
              />
            </th>
          )}
          {header && header.length > 1 ? (
            header
              .filter((head) => !head?.hidden ?? false)
              .map((head, i) => {
                if (head?.custom && head?.customheader) {
                  return (
                    <th
                      style={{
                        textAlign: head?.right ? "right" : "left",
                        position: head?.sticky ? "sticky" : "unset",
                        padding: "6px 12px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                        background: "#0D2555",
                        right:
                          header.findIndex((_head) => head.id === _head.id) >
                          header.length / 2
                            ? 0.1
                            : 0,
                        left:
                          header.findIndex((_head) => head.id === _head.id) <
                          header.length / 2
                            ? selectableRows
                              ? 37
                              : 0.1
                            : 0,
                      }}
                    >
                      {head.customheader()}
                      {head?.sortable && (
                        <IconSort
                          id={head.sortId}
                          sort={sorting.id === head.sortId ? sorting.sort : ""}
                        />
                      )}
                    </th>
                  );
                }
                return (
                  <th
                    key={`${head.id}` + i}
                    style={{
                      fontWeight: 500,
                      color: "#FFFFFF",
                      whiteSpace: "nowrap",
                      padding: "6px 12px",
                      background: "#0D2555",
                      textAlign: head?.right ? "right" : "left",
                      position: head?.sticky ? "sticky" : "unset",
                      right:
                        header.findIndex((_head) => head.id === _head.id) >
                        header.length / 2
                          ? 0.1
                          : 0,
                      left:
                        header.findIndex((_head) => head.id === _head.id) <
                        header.length / 2
                          ? selectableRows
                            ? 37
                            : 0.1
                          : 0,
                    }}
                  >
                    {head?.label ?? "-"}
                    {head?.sortable && (
                      <IconSort
                        id={head.sortId}
                        sort={sorting.id === head.sortId ? sorting.sort : ""}
                      />
                    )}
                  </th>
                );
              })
          ) : (
            <th>no header</th>
          )}
        </tr>
      </thead>
      <tbody style={{ fontSize: "12px", overflowX: 'scroll', whiteSpace: 'nowrap' }}>
        <DataTable />
      </tbody>
    </Table>
  );
}

export default TableGeneral;
